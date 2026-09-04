"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { initiateStkPush, queryStkPushStatus, normalizeMsisdn } from "@/lib/mpesa/client";
import { completeMpesaTransaction } from "@/lib/admin/billing-cascade";

const initiateSchema = z.object({ invoice_id: z.string().min(1), phone: z.string().min(9) });

export async function initiateMpesaPayment(formData: FormData) {
  const admin = await requireAdmin("edos-centre");
  const parsed = initiateSchema.parse(Object.fromEntries(formData));
  const phone = normalizeMsisdn(parsed.phone);

  const supabase = await createServiceClient();
  const { data: invoice, error } = await supabase
    .from("edoscentreadmin_invoices")
    .select("id, invoice_number, total, status")
    .eq("id", parsed.invoice_id)
    .single();
  if (error) throw new Error(error.message);
  if (invoice.status === "paid" || invoice.status === "cancelled") {
    throw new Error(`Invoice is already ${invoice.status}.`);
  }

  const { data: paid } = await supabase
    .from("edoscentreadmin_payments")
    .select("amount")
    .eq("invoice_id", invoice.id)
    .eq("status", "completed");
  const alreadyPaid = (paid ?? []).reduce((sum, p) => sum + Number(p.amount), 0);
  const balance = Number(invoice.total) - alreadyPaid;
  if (balance <= 0) throw new Error("This invoice has no remaining balance.");

  const result = await initiateStkPush({
    phone,
    amount: balance,
    accountReference: invoice.invoice_number,
    transactionDesc: invoice.invoice_number,
  });

  const { error: insertError } = await supabase.from("edoscentreadmin_mpesa_transactions").insert({
    invoice_id: invoice.id,
    phone_number: phone,
    amount: balance,
    merchant_request_id: result.merchantRequestId,
    checkout_request_id: result.checkoutRequestId,
    status: "pending",
    initiated_by: admin.id,
  });
  if (insertError) throw new Error(insertError.message);

  await logAudit({ actorId: admin.id, action: "mpesa_stk_push_sent", metadata: { invoice_number: invoice.invoice_number, phone } });
  revalidatePath("/admin/invoices");

  return { customerMessage: result.customerMessage };
}

/**
 * Fallback for when the Daraja callback hasn't landed yet (e.g. no public callback
 * URL registered during dev) — polls Safaricom directly, which works from anywhere
 * since it's an outbound call we make, unlike the callback which needs Safaricom to
 * reach us.
 */
export async function checkMpesaTransactionStatus(id: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();

  const { data: txn, error } = await supabase.from("edoscentreadmin_mpesa_transactions").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  if (txn.status !== "pending") return { status: txn.status as string };
  if (!txn.checkout_request_id) throw new Error("Missing checkout request id.");

  const result = await queryStkPushStatus(txn.checkout_request_id);

  if (result.state === "pending") return { status: "pending" };

  if (result.state === "failed") {
    await supabase
      .from("edoscentreadmin_mpesa_transactions")
      .update({ status: "failed", result_code: result.resultCode, result_desc: result.resultDesc })
      .eq("id", id);
    revalidatePath("/admin/invoices");
    return { status: "failed", reason: result.resultDesc };
  }

  await completeMpesaTransaction(id, { actorId: admin.id });
  return { status: "completed" };
}
