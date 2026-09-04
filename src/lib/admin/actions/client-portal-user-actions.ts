"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";

function generateTempPassword() {
  return `${randomBytes(9).toString("base64url")}!1`;
}

const inviteSchema = z.object({
  client_id: z.string().min(1),
  email: z.string().email(),
  full_name: z.string().optional(),
});

/**
 * Same "reuse the existing auth identity if this email is already registered"
 * approach as inviteAdminUser — auth.users is shared across every tenant app
 * in this Supabase project, so we never overwrite an existing password.
 */
export async function invitePortalUser(formData: FormData) {
  const admin = await requireAdmin("edos-centre");
  const parsed = inviteSchema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();
  const tempPassword = generateTempPassword();

  let userId: string;
  let isNewAccount = true;

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: parsed.email,
    password: tempPassword,
    email_confirm: true,
  });

  if (createError) {
    if (!createError.message.toLowerCase().includes("already been registered")) {
      throw new Error(createError.message);
    }
    isNewAccount = false;
    const { data: list, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw new Error(listError.message);
    const existing = list.users.find((u) => u.email?.toLowerCase() === parsed.email.toLowerCase());
    if (!existing) throw new Error("Could not find the existing account for that email.");
    userId = existing.id;
  } else {
    userId = created.user.id;
  }

  const { error: upsertError } = await supabase.from("edoscentreadmin_client_portal_users").upsert(
    {
      id: userId,
      client_id: parsed.client_id,
      email: parsed.email,
      full_name: parsed.full_name || null,
      is_active: true,
      must_change_password: isNewAccount,
    },
    { onConflict: "id" },
  );
  if (upsertError) throw new Error(upsertError.message);

  await logAudit({
    actorId: admin.id,
    action: isNewAccount ? "portal_user_invited" : "portal_user_granted_access",
    metadata: { email: parsed.email, client_id: parsed.client_id },
  });
  revalidatePath("/admin/clients");

  return { email: parsed.email, tempPassword: isNewAccount ? tempPassword : null, isNewAccount };
}

export async function setPortalUserActive(id: string, isActive: boolean) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentreadmin_client_portal_users").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: isActive ? "portal_user_activated" : "portal_user_deactivated", metadata: { id } });
  revalidatePath("/admin/clients");
}

export async function resetPortalUserPassword(id: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const tempPassword = generateTempPassword();

  const { error: pwError } = await supabase.auth.admin.updateUserById(id, { password: tempPassword });
  if (pwError) throw new Error(pwError.message);

  const { error } = await supabase.from("edoscentreadmin_client_portal_users").update({ must_change_password: true }).eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "portal_user_password_reset", metadata: { id } });
  revalidatePath("/admin/clients");
  return { tempPassword };
}
