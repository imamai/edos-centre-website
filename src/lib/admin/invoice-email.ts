import "server-only";
import { Resend } from "resend";
import { getInvoiceForDocument, type InvoiceForDocument } from "@/lib/admin/queries";
import { getSiteSettings } from "@/lib/queries";
import { absoluteUrl } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

function money(n: number, currency: string) {
  return `${currency} ${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export type InvoiceEmailKind = "view" | "payment_received" | "reminder_due_soon" | "reminder_overdue";

function subjectFor(kind: InvoiceEmailKind, invoice: InvoiceForDocument): string {
  const amount = money(invoice.total, invoice.currency);
  switch (kind) {
    case "payment_received":
      return `Payment received — Invoice ${invoice.invoice_number} (${amount})`;
    case "reminder_due_soon":
      return `Reminder: Invoice ${invoice.invoice_number} due ${formatDate(invoice.due_date)}`;
    case "reminder_overdue":
      return `Overdue: Invoice ${invoice.invoice_number} (${amount})`;
    default:
      return `Invoice ${invoice.invoice_number} from Edos Centre — ${amount}`;
  }
}

function statusLineFor(
  kind: InvoiceEmailKind,
  invoice: InvoiceForDocument,
  paidOn: string,
): { icon: string; color: string; text: string } {
  switch (kind) {
    case "payment_received":
      return { icon: "&#9989;", color: "#059669", text: `Paid on ${formatDate(paidOn)}` };
    case "reminder_due_soon":
      return { icon: "&#128337;", color: "#b45309", text: `Due ${formatDate(invoice.due_date)}` };
    case "reminder_overdue":
      return { icon: "&#128308;", color: "#dc2626", text: `Overdue since ${formatDate(invoice.due_date)}` };
    default:
      return invoice.status === "paid"
        ? { icon: "&#9989;", color: "#059669", text: `Paid` }
        : { icon: "&#128337;", color: "#4b5563", text: `Due ${formatDate(invoice.due_date)}` };
  }
}

function invoiceEmailHtml({
  invoice,
  kind,
  viewUrl,
  memo,
  logoUrl,
  paidOn,
}: {
  invoice: InvoiceForDocument;
  kind: InvoiceEmailKind;
  viewUrl: string;
  memo: string;
  logoUrl: string;
  paidOn: string;
}) {
  const status = statusLineFor(kind, invoice, paidOn);
  const intro =
    kind === "reminder_due_soon"
      ? `This is a friendly reminder that invoice ${invoice.invoice_number} is coming due.`
      : kind === "reminder_overdue"
        ? `Invoice ${invoice.invoice_number} is now past its due date. Please arrange payment at your earliest convenience.`
        : kind === "payment_received"
          ? `We've received your payment — thank you.`
          : null;

  return `
<div style="max-width:480px;margin:0 auto;padding:32px 24px;font-family:Arial,Helvetica,sans-serif;color:#1A1733;">
  <div style="margin-bottom:32px;">
    <img src="${logoUrl}" alt="Edos Centre" width="32" height="32" style="display:inline-block;vertical-align:middle;border-radius:8px;" />
    <span style="font-size:18px;font-weight:700;vertical-align:middle;margin-left:10px;">Edos Centre</span>
  </div>

  ${intro ? `<p style="font-size:14px;color:#374151;margin:0 0 20px;">${intro}</p>` : ""}

  <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;">
    <div style="font-size:12px;letter-spacing:0.05em;color:#6b7280;text-transform:uppercase;">Invoice No. ${invoice.invoice_number}</div>
    <div style="font-size:40px;font-weight:700;margin:12px 0;color:#111827;">${money(invoice.total, invoice.currency)}</div>

    <div style="color:${status.color};font-size:14px;margin-bottom:28px;">
      ${status.icon} ${status.text}
    </div>

    <a href="${viewUrl}" style="display:block;text-align:center;background:#1A1733;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 0;border-radius:10px;">
      View invoice
    </a>
  </div>

  <div style="background:#f3f4f6;border-radius:12px;padding:20px;margin-top:20px;font-size:13px;line-height:1.6;color:#4b5563;">
    ${memo}
  </div>

  <div style="text-align:center;color:#9ca3af;font-size:12px;margin-top:24px;">
    Sent by Edos Centre
  </div>
</div>`;
}

/**
 * Core send used by the manual "Email invoice" admin action, the automatic
 * payment-received email (billing-cascade.ts), and automatic reminder emails
 * (automation.ts). Never throws for missing config or a missing client email in
 * automated contexts — callers pass `throwOnSkip: true` only for the manual,
 * user-initiated send where silent failure would be confusing.
 */
export async function sendInvoiceStatusEmail(
  invoiceId: string,
  kind: InvoiceEmailKind,
  opts: { throwOnSkip?: boolean; paidOn?: string } = {},
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    const reason = "Email isn't configured — set RESEND_API_KEY and RESEND_FROM_EMAIL.";
    if (opts.throwOnSkip) throw new Error(reason);
    return { sent: false, reason };
  }

  const invoice = await getInvoiceForDocument(invoiceId);
  if (!invoice) {
    if (opts.throwOnSkip) throw new Error("Invoice not found.");
    return { sent: false, reason: "invoice_not_found" };
  }

  const client = invoice.edoscentreadmin_clients;
  if (!client?.email) {
    const reason = `${client?.company_name ?? "This client"} has no email on file.`;
    if (opts.throwOnSkip) throw new Error(reason);
    return { sent: false, reason: "no_client_email" };
  }

  const settings = await getSiteSettings();
  const viewUrl = absoluteUrl(`/invoice/${invoice.id}`);
  const memo = invoice.notes
    ? invoice.notes
    : `Thank you for working with Edos Centre.${settings.contact_email ? ` Questions about this invoice? Reach us at ${settings.contact_email}.` : ""}`;

  const html = invoiceEmailHtml({
    invoice,
    kind,
    viewUrl,
    memo,
    logoUrl: absoluteUrl("/apple-touch-icon.png"),
    paidOn: opts.paidOn ?? new Date().toISOString().slice(0, 10),
  });

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: `Edos Centre <${fromEmail}>`,
    to: client.email,
    subject: subjectFor(kind, invoice),
    html,
  });
  if (error) {
    if (opts.throwOnSkip) throw new Error(error.message);
    return { sent: false, reason: error.message };
  }

  return { sent: true };
}
