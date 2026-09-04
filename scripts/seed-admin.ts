/**
 * One-off bootstrap script: creates the initial EDOS Control Centre super admin.
 * Run once: node --env-file=.env.local --experimental-strip-types scripts/seed-admin.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment
 * (loaded from .env.local via --env-file). The bootstrap password is only ever sent
 * to Supabase Auth's own hashed storage — it is never written into any of our own
 * tables.
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/database.types";

const ADMIN_EMAIL = "admin@edoscentre.co.ke";
// NOTE: "admin123" (the password originally requested) is a well-known leaked/common
// password. This Supabase project rejects it at sign-in (generic "invalid_credentials",
// even though account creation itself doesn't complain) — that's the project's own
// leaked-password protection working as intended, not a bug to route around. Use a
// bootstrap password that's still temporary (must_change_password forces a real one on
// first login) but isn't on every breach list.
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "EdosAdmin#2026!";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (check .env.local).");
  }

  const supabase = createClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let userId: string;

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });

  if (createError) {
    if (!createError.message.toLowerCase().includes("already been registered")) {
      throw createError;
    }
    console.log(`Auth user ${ADMIN_EMAIL} already exists — reusing it and resetting its password.`);
    const { data: list, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;
    const existing = list.users.find((u) => u.email === ADMIN_EMAIL);
    if (!existing) throw new Error("Could not find the existing auth user.");
    userId = existing.id;
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, { password: ADMIN_PASSWORD });
    if (updateError) throw updateError;
  } else {
    userId = created.user.id;
    console.log(`Created auth user ${ADMIN_EMAIL} (${userId}).`);
  }

  const { error: upsertError } = await supabase.from("edoscentreadmin_admin_users").upsert(
    {
      id: userId,
      email: ADMIN_EMAIL,
      full_name: "EDOS Centre Administrator",
      role: "super_admin",
      is_active: true,
      must_change_password: true,
    },
    { onConflict: "id" },
  );
  if (upsertError) throw upsertError;
  console.log("Registered super_admin row in edoscentreadmin_admin_users.");

  const { error: websiteError } = await supabase.from("edoscentreadmin_websites").upsert(
    {
      slug: "edos-centre",
      name: "EDOS Centre",
      domain: "edoscentre.co.ke",
      status: "active",
      primary_admin_email: ADMIN_EMAIL,
    },
    { onConflict: "slug" },
  );
  if (websiteError) throw websiteError;
  console.log("Ensured EDOS Centre website registry row.");

  console.log("\nDone. Sign in at /admin/login with:");
  console.log(`  email:    ${ADMIN_EMAIL}`);
  console.log(`  password: ${ADMIN_PASSWORD}  (you will be forced to change this on first login)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
