import "server-only";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";

const CYCLE_MONTHS: Record<string, number> = { monthly: 1, quarterly: 3, semiannual: 6, annual: 12, custom: 1 };

/**
 * Records a payment and cascades the real consequences: recompute invoice status
 * from actual payments received, and — only once the invoice is fully paid —
 * extend the linked subscription's renewal date and reactivate the website if it
 * had been suspended for non-payment. Shared by the manual "Record payment" form
 * and the M-Pesa callback, so both paths behave identically. actorId is null for
 * automated (M-Pesa) payments — audit_logs.actor_id is nullable for exactly this.
 */
export async function applyPaymentCascade(params: {
  invoiceId: string;
  amount: number;
  paymentMethod: "mpesa" | "bank" | "card" | "paypal" | "cash" | "other";
  transactionReference: string | null;
  paymentDate: string;
  recordedBy: string | null;
  actorId: string | null;
  notes?: string | null;
}) {
  const supabase = await createServiceClient();

  const { data: invoice, error: invoiceError } = await supabase
    .from("edoscentreadmin_invoices")
    .select("id, total, subscription_id, website_id, invoice_number")
    .eq("id", params.invoiceId)
    .single();
  if (invoiceError) throw new Error(invoiceError.message);

  const { data: paymentRow, error: paymentError } = await supabase
    .from("edoscentreadmin_payments")
    .insert({
      invoice_id: params.invoiceId,
      amount: params.amount,
      payment_method: params.paymentMethod,
      transaction_reference: params.transactionReference,
      payment_date: params.paymentDate,
      status: "completed",
      notes: params.notes ?? null,
      recorded_by: params.recordedBy,
    })
    .select("id")
    .single();
  if (paymentError) throw new Error(paymentError.message);

  await logAudit({
    actorId: params.actorId,
    action: "payment_recorded",
    metadata: { invoice_number: invoice.invoice_number, amount: params.amount, method: params.paymentMethod },
  });

  const { data: payments } = await supabase
    .from("edoscentreadmin_payments")
    .select("amount")
    .eq("invoice_id", params.invoiceId)
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

      await logAudit({ actorId: params.actorId, action: "subscription_renewed", websiteId: subscription.website_id, metadata: { renewal_date: newRenewalDate } });

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
            status_changed_by: params.actorId,
          })
          .eq("id", website.id);

        await logAudit({ actorId: params.actorId, action: "website_activated", websiteId: website.id, metadata: { reason: "payment_received" } });
        revalidatePath("/", "layout");
      }
    }
  }

  revalidatePath("/admin/invoices");
  revalidatePath("/admin/subscriptions");
  revalidatePath("/admin/websites");
  revalidatePath("/admin");

  return { paymentId: paymentRow.id as string, newInvoiceStatus };
}

/**
 * Marks a pending M-Pesa transaction as completed and runs the same payment
 * cascade as a manual entry. Idempotent — safe to call from both the Daraja
 * callback and a manual "check status" fallback without double-recording,
 * since a callback delivery and a manual poll could both resolve the same
 * transaction.
 */
export async function completeMpesaTransaction(
  transactionId: string,
  params: { mpesaReceiptNumber?: string; transactionDate?: string; actorId: string | null },
) {
  const supabase = await createServiceClient();
  const { data: txn, error } = await supabase
    .from("edoscentreadmin_mpesa_transactions")
    .select("id, invoice_id, amount, status")
    .eq("id", transactionId)
    .single();
  if (error) throw new Error(error.message);
  if (txn.status === "completed") return;

  const { paymentId } = await applyPaymentCascade({
    invoiceId: txn.invoice_id,
    amount: Number(txn.amount),
    paymentMethod: "mpesa",
    transactionReference: params.mpesaReceiptNumber ?? null,
    paymentDate: (params.transactionDate ?? new Date().toISOString()).slice(0, 10),
    recordedBy: null,
    actorId: params.actorId,
    notes: "Recorded automatically via M-Pesa STK push.",
  });

  await supabase
    .from("edoscentreadmin_mpesa_transactions")
    .update({
      status: "completed",
      result_code: "0",
      result_desc: "Success",
      mpesa_receipt_number: params.mpesaReceiptNumber ?? null,
      transaction_date: params.transactionDate ?? new Date().toISOString(),
      payment_id: paymentId,
    })
    .eq("id", transactionId);

  revalidatePath("/admin/invoices");
}
