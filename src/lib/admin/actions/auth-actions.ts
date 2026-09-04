"use server";

import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getAdminUser, requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";

export async function verifyAndRecordLogin(): Promise<
  { ok: true; mustChangePassword: boolean } | { ok: false; reason: string }
> {
  const adminUser = await getAdminUser();
  if (!adminUser) return { ok: false, reason: "This account is not authorized for admin access." };
  if (!adminUser.is_active) return { ok: false, reason: "This administrator account has been deactivated." };

  const supabase = await createServiceClient();
  await supabase
    .from("edoscentreadmin_admin_users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", adminUser.id);

  await logAudit({ actorId: adminUser.id, action: "login" });

  return { ok: true, mustChangePassword: adminUser.must_change_password };
}

export async function completePasswordChange() {
  const adminUser = await requireAdmin();
  const supabase = await createServiceClient();
  await supabase
    .from("edoscentreadmin_admin_users")
    .update({ must_change_password: false })
    .eq("id", adminUser.id);

  await logAudit({ actorId: adminUser.id, action: "password_change" });
}

export async function logoutAction() {
  const adminUser = await getAdminUser();
  const supabase = await createClient();
  if (adminUser) await logAudit({ actorId: adminUser.id, action: "logout" });
  await supabase.auth.signOut();
  redirect("/admin/login");
}
