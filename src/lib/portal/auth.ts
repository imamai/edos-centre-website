import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ClientPortalUserRow } from "@/types/database.types";

export async function getPortalUser(): Promise<ClientPortalUserRow | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("edoscentreadmin_client_portal_users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return data ?? null;
}

/** Server-action guard: throws if there is no active portal session. */
export async function requirePortalUser(): Promise<ClientPortalUserRow> {
  const portalUser = await getPortalUser();
  if (!portalUser || !portalUser.is_active) throw new Error("UNAUTHORIZED");
  return portalUser;
}
