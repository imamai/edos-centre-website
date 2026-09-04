"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";

export async function updateContactStatus(id: string, status: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_contact_inquiries").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "contact_inquiry_status_changed", metadata: { id, status } });
  revalidatePath("/admin/websites/edos-centre/forms");
}

export async function updateConsultationStatus(id: string, status: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_consultation_bookings").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "consultation_status_changed", metadata: { id, status } });
  revalidatePath("/admin/websites/edos-centre/forms");
}

export async function updateNewsletterStatus(id: string, status: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from("edoscentre_newsletter_subscribers")
    .update({ status, unsubscribed_at: status === "unsubscribed" ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "newsletter_status_changed", metadata: { id, status } });
  revalidatePath("/admin/websites/edos-centre/forms");
}
