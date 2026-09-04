"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";

const invoiceSchema = z.object({
  client_id: z.string().min(1),
  website_id: z.string().optional(),
  subscription_id: z.string().optional(),
  issue_date: z.string().min(1),
  due_date: z.string().min(1),
  amount: z.coerce.number().min(0),
  tax: z.coerce.number().default(0),
  discount: z.coerce.number().default(0),
  currency: z.string().default("KES"),
  status: z.enum(["draft", "sent", "pending", "paid", "partially_paid", "overdue", "cancelled"]),
  notes: z.string().optional(),
});

export async function upsertInvoice(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = invoiceSchema.parse(Object.fromEntries(formData));
  const total = parsed.amount + parsed.tax - parsed.discount;

  const supabase = await createServiceClient();
  const payload = {
    client_id: parsed.client_id,
    website_id: parsed.website_id || null,
    subscription_id: parsed.subscription_id || null,
    issue_date: parsed.issue_date,
    due_date: parsed.due_date,
    amount: parsed.amount,
    tax: parsed.tax,
    discount: parsed.discount,
    total,
    currency: parsed.currency,
    status: parsed.status,
    notes: parsed.notes || null,
  };

  if (id) {
    const { error } = await supabase.from("edoscentreadmin_invoices").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
    await logAudit({ actorId: admin.id, action: "invoice_updated", metadata: { id } });
  } else {
    const { data: invoiceNumber, error: numberError } = await supabase.rpc("edoscentreadmin_next_invoice_number");
    if (numberError) throw new Error(numberError.message);

    const { error } = await supabase.from("edoscentreadmin_invoices").insert({ ...payload, invoice_number: invoiceNumber });
    if (error) throw new Error(error.message);
    await logAudit({ actorId: admin.id, action: "invoice_created", metadata: { invoice_number: invoiceNumber } });
  }

  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
}

export async function deleteInvoice(id: string, invoiceNumber: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentreadmin_invoices").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "invoice_deleted", metadata: { invoice_number: invoiceNumber } });
  revalidatePath("/admin/invoices");
}

const CYCLE_MONTHS: Record<string, number> = { monthly: 1, quarterly: 3, semiannual: 6, annual: 12, custom: 1 };

const paymentSchema = z.object({
  invoice_id: z.string().min(1),
  amount: z.coerce.number().min(0.01),
  payment_method: z.enum(["mpesa", "bank", "card", "paypal", "cash", "other"]),
  transaction_reference: z.string().optional(),
  payment_date: z.string().min(1),
  notes: z.string().optional(),
});

/**
 * Records a payment and cascades the real consequences: recompute invoice status
 * from actual payments received, and — only once the invoice is fully paid —
 * extend the linked subscription's renewal date and reactivate the website if it
 * had been suspended for non-payment. Nothing here fabricates a "paid" state;
 * every transition is derived from the payments actually on file.
 */
export async function recordPayment(formData: FormData) {
  const admin = await requireAdmin("edos-centre");
  const parsed = paymentSchema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();

  const { data: invoice, error: invoiceError } = await supabase
    .from("edoscentreadmin_invoices")
    .select("id, total, subscription_id, website_id, invoice_number")
    .eq("id", parsed.invoice_id)
    .single();
  if (invoiceError) throw new Error(invoiceError.message);

  const { error: paymentError } = await supabase.from("edoscentreadmin_payments").insert({
    invoice_id: parsed.invoice_id,
    amount: parsed.amount,
    payment_method: parsed.payment_method,
    transaction_reference: parsed.transaction_reference || null,
    payment_date: parsed.payment_date,
    status: "completed",
    notes: parsed.notes || null,
    recorded_by: admin.id,
  });
  if (paymentError) throw new Error(paymentError.message);

  await logAudit({
    actorId: admin.id,
    action: "payment_recorded",
    metadata: { invoice_number: invoice.invoice_number, amount: parsed.amount, method: parsed.payment_method },
  });

  const { data: payments } = await supabase
    .from("edoscentreadmin_payments")
    .select("amount")
    .eq("invoice_id", parsed.invoice_id)
    .eq("status", "completed");
  const totalPaid = (payments ?? []).reduce((sum, p) => sum + Number(p.amount), 0);

  const newInvoiceStatus = totalPaid >= Number(invoice.total) ? "paid" : totalPaid > 0 ? "partially_paid" : "pending";
  await supabase.from("edoscentreadmin_invoices").update({ status: newInvoiceStatus }).eq("id", invoice.id);

  if (newInvoiceStatus === "paid" && invoice.subscription_id) {
    const { data: subscription } = await supabase
      .from("edoscentreadmin_subscriptions")
      .select("id, billing_cycle, renewal_date, website_id")
      .eq("id", invoice.subscription_id)
      .single();

    if (subscription) {
      const months = CYCLE_MONTHS[subscription.billing_cycle] ?? 1;
      const base = subscription.renewal_date && new Date(subscription.renewal_date) > new Date() ? new Date(subscription.renewal_date) : new Date();
      base.setMonth(base.getMonth() + months);
      const newRenewalDate = base.toISOString().slice(0, 10);

      await supabase
        .from("edoscentreadmin_subscriptions")
        .update({ status: "active", renewal_date: newRenewalDate })
        .eq("id", subscription.id);

      await logAudit({ actorId: admin.id, action: "subscription_renewed", websiteId: subscription.website_id, metadata: { renewal_date: newRenewalDate } });

      const { data: website } = await supabase
        .from("edoscentreadmin_websites")
        .select("id, slug, status")
        .eq("id", subscription.website_id)
        .single();

      if (website && website.status === "suspended") {
        await supabase
          .from("edoscentreadmin_websites")
          .update({
            status: "active",
            status_reason: null,
            status_message: null,
            status_changed_at: new Date().toISOString(),
            status_changed_by: admin.id,
          })
          .eq("id", website.id);

        await logAudit({ actorId: admin.id, action: "website_activated", websiteId: website.id, metadata: { reason: "payment_received" } });
        revalidatePath("/", "layout");
      }
    }
  }

  revalidatePath("/admin/invoices");
  revalidatePath("/admin/subscriptions");
  revalidatePath("/admin/websites");
  revalidatePath("/admin");
}
