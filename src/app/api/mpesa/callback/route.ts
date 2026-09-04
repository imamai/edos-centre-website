import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { completeMpesaTransaction } from "@/lib/admin/billing-cascade";

/**
 * Daraja posts the STK push result here, unauthenticated — Safaricom doesn't sign
 * callbacks or offer a shared-secret mechanism for this endpoint. The realistic
 * security boundary is CheckoutRequestID itself: it's an opaque, unguessable value
 * Safaricom generates and returns only to our own initiateStkPush call, stored
 * server-side and never exposed publicly, so an attacker would need to already
 * know a specific pending transaction's ID to forge a callback for it. This is the
 * standard trust model for Daraja integrations — Safaricom provides nothing
 * stronger without a dedicated VPN/IP-allowlist arrangement.
 *
 * Always responds 200 with ResultCode 0 regardless of internal outcome — Daraja
 * retries aggressively on non-200/non-zero responses, which we don't want for
 * errors on our side that a retry won't fix (e.g. a transaction row that's already
 * been resolved).
 */
function ack() {
  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}

function parseDarajaTimestamp(raw: string): string {
  const y = raw.slice(0, 4);
  const mo = raw.slice(4, 6);
  const d = raw.slice(6, 8);
  const h = raw.slice(8, 10);
  const mi = raw.slice(10, 12);
  const s = raw.slice(12, 14);
  return `${y}-${mo}-${d}T${h}:${mi}:${s}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const stkCallback = body?.Body?.stkCallback;
    if (!stkCallback?.CheckoutRequestID) {
      console.error("[mpesa-callback] malformed payload:", JSON.stringify(body).slice(0, 500));
      return ack();
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID as string;
    const resultCode = Number(stkCallback.ResultCode);
    const resultDesc = String(stkCallback.ResultDesc ?? "");

    const supabase = await createServiceClient();
    const { data: txn } = await supabase
      .from("edoscentreadmin_mpesa_transactions")
      .select("id, status")
      .eq("checkout_request_id", checkoutRequestId)
      .maybeSingle();

    if (!txn) {
      console.error("[mpesa-callback] no matching transaction for CheckoutRequestID:", checkoutRequestId);
      return ack();
    }
    if (txn.status !== "pending") {
      return ack(); // already resolved (callback delivered twice, or a manual status check beat it) — idempotent no-op
    }

    if (resultCode === 0) {
      const items: { Name: string; Value: unknown }[] = stkCallback.CallbackMetadata?.Item ?? [];
      const get = (name: string) => items.find((i) => i.Name === name)?.Value;
      const receiptNumber = get("MpesaReceiptNumber") as string | undefined;
      const rawDate = get("TransactionDate");
      const transactionDate = rawDate ? parseDarajaTimestamp(String(rawDate)) : undefined;

      await completeMpesaTransaction(txn.id, { mpesaReceiptNumber: receiptNumber, transactionDate, actorId: null });
    } else {
      await supabase
        .from("edoscentreadmin_mpesa_transactions")
        .update({ status: resultCode === 1032 ? "cancelled" : "failed", result_code: String(resultCode), result_desc: resultDesc })
        .eq("id", txn.id);
    }

    return ack();
  } catch (err) {
    console.error("[mpesa-callback] error:", err);
    return ack();
  }
}
