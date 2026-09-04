import { createServerClient, type CookieMethodsServer } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

function cookieMethods(cookieStore: Awaited<ReturnType<typeof cookies>>): CookieMethodsServer {
  return {
    getAll() { return cookieStore.getAll(); },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        );
      } catch { /* Server component – ignore */ }
    },
  };
}

/** Session-bound client (RLS enforced as the current user). */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieMethods(cookieStore) },
  );
}

/**
 * Anon-key client with no cookie/session handling — safe to call from anywhere,
 * including generateStaticParams and other build-time contexts where next/headers'
 * cookies() throws (no request to read cookies from). Public content reads (services,
 * blog, industries, etc.) never need a user session — RLS still applies, just as an
 * anonymous visitor, identical to what createClient() would enforce for anon on these
 * public-read tables.
 */
export function createStaticClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/**
 * Stateless service-role client (bypasses RLS entirely). Deliberately NOT built on
 * @supabase/ssr's cookie-bound client — that wrapper is designed to act as the current
 * user, and even when handed the service-role key it can end up issuing requests under
 * the caller's session instead of the service role. Only ever call this after an
 * explicit server-side authorization check (see requireAdmin).
 */
export async function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
