import "server-only";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * DB-backed sliding-window rate limit (see migration 016). Returns true if the
 * request is within the limit. Fails open (returns true) if the check itself
 * errors, so a transient DB issue degrades to "unprotected" rather than
 * "site down" — public form availability matters more than blocking a burst.
 */
export async function checkRateLimit(bucket: string, identifier: string, limit: number, windowSeconds: number): Promise<boolean> {
  const supabase = await createServiceClient();
  const { data, error } = await supabase.rpc("edoscentre_check_rate_limit", {
    p_key: `${bucket}:${identifier}`,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error("[rate-limit] check failed:", error.message);
    return true;
  }
  return data === true;
}

export function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}
