"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createClient } from "@/lib/supabase/server";
import { runAutomationSweep } from "@/lib/admin/automation";

export async function markNotificationRead(id: string) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("edoscentreadmin_notifications").update({ is_read: true }).eq("id", id).eq("recipient_id", admin.id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/notifications");
}

export async function markAllNotificationsRead() {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("edoscentreadmin_notifications").update({ is_read: true }).eq("recipient_id", admin.id).eq("is_read", false);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/notifications");
}

export async function runAutomationSweepAction() {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") throw new Error("Only super admins can run the automation sweep.");

  const result = await runAutomationSweep();
  await logAudit({ actorId: admin.id, action: "automation_sweep_run", metadata: result });
  revalidatePath("/admin/notifications");
  revalidatePath("/admin");
  return result;
}
