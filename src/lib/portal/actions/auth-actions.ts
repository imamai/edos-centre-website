"use server";

import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getPortalUser, requirePortalUser } from "@/lib/portal/auth";

export async function verifyAndRecordPortalLogin(): Promise<
  { ok: true; mustChangePassword: boolean } | { ok: false; reason: string }
> {
  const portalUser = await getPortalUser();
  if (!portalUser) return { ok: false, reason: "This account does not have portal access." };
  if (!portalUser.is_active) return { ok: false, reason: "This account has been deactivated." };

  const supabase = await createServiceClient();
  await supabase
    .from("edoscentreadmin_client_portal_users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", portalUser.id);

  return { ok: true, mustChangePassword: portalUser.must_change_password };
}

export async function completePortalPasswordChange() {
  const portalUser = await requirePortalUser();
  const supabase = await createServiceClient();
  await supabase
    .from("edoscentreadmin_client_portal_users")
    .update({ must_change_password: false })
    .eq("id", portalUser.id);
}

export async function portalLogoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}
