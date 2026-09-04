import "server-only";

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured. Add it to .env.local — see .env.example.`);
  return value;
}

function baseUrl(): string {
  return process.env.MPESA_ENV === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function stkPassword(shortcode: string, passkey: string, ts: string): string {
  return Buffer.from(`${shortcode}${passkey}${ts}`).toString("base64");
}

/** Kenyan MSISDN formats (07XXXXXXXX, +2547XXXXXXXX, 2547XXXXXXXX) -> 2547XXXXXXXX, as Daraja requires. */
export function normalizeMsisdn(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") && digits.length === 9) return `254${digits}`;
  throw new Error(`"${phone}" doesn't look like a valid Kenyan phone number.`);
}

async function getAccessToken(): Promise<string> {
  const consumerKey = env("MPESA_CONSUMER_KEY");
  const consumerSecret = env("MPESA_CONSUMER_SECRET");
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const res = await fetch(`${baseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
  });
  const body = await res.json();
  if (!res.ok || !body.access_token) {
    throw new Error(`M-Pesa auth failed: ${body.error_description ?? body.errorMessage ?? res.statusText}`);
  }
  return body.access_token as string;
}

export interface StkPushResult {
  merchantRequestId: string;
  checkoutRequestId: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
}

export async function initiateStkPush(params: {
  phone: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}): Promise<StkPushResult> {
  const shortcode = env("MPESA_SHORTCODE");
  const passkey = env("MPESA_PASSKEY");
  const callbackUrl = env("MPESA_CALLBACK_URL");
  const ts = timestamp();
  const accessToken = await getAccessToken();

  const res = await fetch(`${baseUrl()}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: stkPassword(shortcode, passkey, ts),
      Timestamp: ts,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(params.amount),
      PartyA: params.phone,
      PartyB: shortcode,
      PhoneNumber: params.phone,
      CallBackURL: callbackUrl,
      AccountReference: params.accountReference.slice(0, 12),
      TransactionDesc: params.transactionDesc.slice(0, 13),
    }),
  });
  const body = await res.json();

  if (!res.ok || body.ResponseCode !== "0") {
    throw new Error(body.errorMessage ?? body.ResponseDescription ?? "M-Pesa STK push request failed.");
  }

  return {
    merchantRequestId: body.MerchantRequestID,
    checkoutRequestId: body.CheckoutRequestID,
    responseCode: body.ResponseCode,
    responseDescription: body.ResponseDescription,
    customerMessage: body.CustomerMessage,
  };
}

export type StkQueryResult =
  | { state: "pending" }
  | { state: "success"; mpesaReceiptNumber?: string }
  | { state: "failed"; resultCode: string; resultDesc: string };

/** Outbound call to Safaricom — works from any environment, no public callback URL needed. Useful as a fallback when the callback hasn't landed (or during dev, before a tunnel exists). */
export async function queryStkPushStatus(checkoutRequestId: string): Promise<StkQueryResult> {
  const shortcode = env("MPESA_SHORTCODE");
  const passkey = env("MPESA_PASSKEY");
  const ts = timestamp();
  const accessToken = await getAccessToken();

  const res = await fetch(`${baseUrl()}/mpesa/stkpushquery/v1/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: stkPassword(shortcode, passkey, ts),
      Timestamp: ts,
      CheckoutRequestID: checkoutRequestId,
    }),
  });
  const body = await res.json();

  // While the transaction is still being processed, Daraja returns an HTTP error
  // with this specific errorCode rather than a ResultCode — that's "pending", not a failure.
  if (!res.ok) {
    if (body.errorCode === "500.001.1001") return { state: "pending" };
    throw new Error(body.errorMessage ?? "M-Pesa status query failed.");
  }

  if (String(body.ResultCode) === "0") return { state: "success" };
  return { state: "failed", resultCode: String(body.ResultCode), resultDesc: body.ResultDesc ?? "Unknown result." };
}
