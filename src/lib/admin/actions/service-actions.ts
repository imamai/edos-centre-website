"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { formBool } from "@/components/admin/ui/Checkbox";
import { slugify } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1),
  tagline: z.string().optional(),
  description: z.string().optional(),
  long_description: z.string().optional(),
  icon: z.string().optional(),
  cover_image_url: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  capabilities: z.string().optional(),
  outcomes: z.string().optional(),
  technology_ids: z.array(z.string()).default([]),
});

function linesToList(value?: string): string[] {
  return (value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export async function upsertService(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const raw = Object.fromEntries(formData);
  const parsed = schema.parse({ ...raw, technology_ids: formData.getAll("technology_ids") });

  const supabase = await createServiceClient();
  const payload = {
    title: parsed.title,
    tagline: parsed.tagline || null,
    description: parsed.description || null,
    long_description: parsed.long_description || null,
    icon: parsed.icon || null,
    cover_image_url: parsed.cover_image_url || null,
    sort_order: parsed.sort_order,
    seo_title: parsed.seo_title || null,
    seo_description: parsed.seo_description || null,
    seo_keywords: null,
    is_featured: formBool(formData, "is_featured"),
    is_active: formBool(formData, "is_active"),
  };

  // Slug is set once at creation and preserved on edit, so renaming a title never
  // breaks the public URL, inbound links, or SEO for an existing entry.
  let serviceId = id;
  let slug: string;
  if (id) {
    const { data: existing, error: fetchErr } = await supabase.from("edoscentre_services").select("slug").eq("id", id).single();
    if (fetchErr) throw new Error(fetchErr.message);
    slug = existing.slug;
    const { error } = await supabase.from("edoscentre_services").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    slug = slugify(parsed.title);
    const { data, error } = await supabase.from("edoscentre_services").insert({ ...payload, slug }).select("id").single();
    if (error) throw new Error(error.message);
    serviceId = data.id;
  }

  await supabase.from("edoscentre_service_capabilities").delete().eq("service_id", serviceId!);
  const capabilities = linesToList(parsed.capabilities);
  if (capabilities.length) {
    await supabase.from("edoscentre_service_capabilities").insert(
      capabilities.map((capability, i) => ({ service_id: serviceId!, capability, sort_order: i })),
    );
  }

  await supabase.from("edoscentre_service_outcomes").delete().eq("service_id", serviceId!);
  const outcomes = linesToList(parsed.outcomes);
  if (outcomes.length) {
    await supabase.from("edoscentre_service_outcomes").insert(
      outcomes.map((outcome, i) => ({ service_id: serviceId!, outcome, sort_order: i })),
    );
  }

  await supabase.from("edoscentre_service_technologies").delete().eq("service_id", serviceId!);
  if (parsed.technology_ids.length) {
    await supabase.from("edoscentre_service_technologies").insert(
      parsed.technology_ids.map((technology_id) => ({ service_id: serviceId!, technology_id })),
    );
  }

  await logAudit({ actorId: admin.id, action: id ? "service_updated" : "service_created", metadata: { title: parsed.title } });
  revalidatePath("/admin/websites/edos-centre/services");
  revalidatePath("/services");
  revalidatePath(`/services/${slug}`);
}

export async function deleteService(id: string, title: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_services").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "service_deleted", metadata: { title } });
  revalidatePath("/admin/websites/edos-centre/services");
  revalidatePath("/services");
}
