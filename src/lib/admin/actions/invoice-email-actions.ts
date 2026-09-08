"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { getInvoiceForDocument } from "@/lib/admin/queries";
import { sendInvoiceStatusEmail } from "@/lib/admin/invoice-email";

/**
 * Manually emails a client a link to their invoice's public, unauthenticated view
 * (src/app/invoice/[id]/page.tsx) — no PDF attachment, matching how hosted invoice
 * links (Stripe, Supabase billing) work. Automatic payment-received and reminder
 * emails use the same underlying sendInvoiceStatusEmail (see billing-cascade.ts
 * and automation.ts) — this is only the admin-triggered "Email" button.
 */
export async function sendInvoiceEmail(invoiceId: string) {
  const admin = await requireAdmin("edos-centre");
  const invoice = await getInvoiceForDocument(invoiceId);
  if (!invoice) throw new Error("Invoice not found.");

  await sendInvoiceStatusEmail(invoiceId, "view", { throwOnSkip: true });

  await logAudit({
    actorId: admin.id,
    action: "invoice_emailed",
    metadata: { invoice_number: invoice.invoice_number, sent_to: invoice.edoscentreadmin_clients?.email },
  });
}
