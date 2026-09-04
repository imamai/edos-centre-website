import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AdminUserRow } from "@/types/database.types";

export async function getAdminUser(): Promise<AdminUserRow | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("edoscentreadmin_admin_users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return data ?? null;
}

export async function hasWebsiteAccess(adminUser: AdminUserRow, websiteSlug: string): Promise<boolean> {
  if (adminUser.role === "super_admin") return true;

  const supabase = await createClient();
  const { data: website } = await supabase
    .from("edoscentreadmin_websites")
    .select("id")
    .eq("slug", websiteSlug)
    .maybeSingle();
  if (!website) return false;

  const { data } = await supabase
    .from("edoscentreadmin_admin_user_websites")
    .select("website_id")
    .eq("admin_user_id", adminUser.id)
    .eq("website_id", website.id)
    .maybeSingle();

  return !!data;
}

/** Server-action guard: throws if there is no active admin session, or (when a website is given) no access to it. */
export async function requireAdmin(websiteSlug?: string): Promise<AdminUserRow> {
  const adminUser = await getAdminUser();
  if (!adminUser || !adminUser.is_active) throw new Error("UNAUTHORIZED");
  if (websiteSlug && !(await hasWebsiteAccess(adminUser, websiteSlug))) throw new Error("UNAUTHORIZED");
  return adminUser;
}
