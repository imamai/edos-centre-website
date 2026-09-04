import "server-only";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Public-facing status check for a managed website. Uses the service-role client
 * deliberately — anonymous visitors have no session, and edoscentreadmin_websites'
 * RLS only grants admins read access (it also holds internal fields like admin
 * emails and notes that shouldn't be exposed to a public SELECT policy). This
 * returns only the handful of fields the public suspension/maintenance page needs.
 */
export async function getPublicWebsiteStatus(slug: string) {
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("edoscentreadmin_websites")
    .select("status, status_message, maintenance_return_at")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}
