"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

async function requireSuperAdmin() {
  const admin = await requireAdmin();
  if (admin.role !== "super_admin") throw new Error("Only super admins can add or remove managed websites.");
  return admin;
}

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  domain: z.string().optional(),
  status: z.enum(["active", "trial", "pending", "suspended", "maintenance", "expired", "archived"]),
  primary_admin_email: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Registers a website for operational tracking (billing, hosting, domains/SSL,
 * status, client portal) — this does NOT give it a CMS. The content management
 * pages under /admin/websites/edos-centre/* are specific to EDOS Centre's own
 * content schema; a newly onboarded website only gets the website-agnostic
 * operational layer built from Phase 4 onward.
 */
export async function upsertWebsite(formData: FormData, id?: string) {
  const admin = await requireSuperAdmin();
  const parsed = schema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();
  const payload = {
    name: parsed.name,
    slug: parsed.slug ? slugify(parsed.slug) : slugify(parsed.name),
    domain: parsed.domain || null,
    status: parsed.status,
    primary_admin_email: parsed.primary_admin_email || null,
    notes: parsed.notes || null,
  };

  const { error } = id
    ? await supabase.from("edoscentreadmin_websites").update(payload).eq("id", id)
    : await supabase.from("edoscentreadmin_websites").insert(payload);
  if (error) {
    if (error.code === "23505") throw new Error(`A website with slug "${payload.slug}" already exists.`);
    throw new Error(error.message);
  }

  await logAudit({ actorId: admin.id, action: id ? "website_updated" : "website_onboarded", metadata: { name: payload.name, slug: payload.slug } });
  revalidatePath("/admin/websites");
  revalidatePath("/admin");
}

export async function deleteWebsite(id: string, name: string) {
  const admin = await requireSuperAdmin();
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentreadmin_websites").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "website_removed", metadata: { name } });
  revalidatePath("/admin/websites");
  revalidatePath("/admin");
}
