"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { formBool } from "@/components/admin/ui/Checkbox";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1),
  tagline: z.string().optional(),
  description: z.string().optional(),
  long_description: z.string().optional(),
  icon: z.string().optional(),
  cover_image_url: z.string().optional(),
  hero_stat: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
  outcomes: z.string().optional(),
  technology_ids: z.array(z.string()).default([]),
});

function linesToList(value?: string): string[] {
  return (value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export async function upsertIndustry(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const raw = Object.fromEntries(formData);
  const parsed = schema.parse({ ...raw, technology_ids: formData.getAll("technology_ids") });

  const supabase = await createServiceClient();
  const payload = {
    name: parsed.name,
    slug: slugify(parsed.name),
    tagline: parsed.tagline || null,
    description: parsed.description || null,
    long_description: parsed.long_description || null,
    icon: parsed.icon || null,
    cover_image_url: parsed.cover_image_url || null,
    hero_stat: parsed.hero_stat || null,
    sort_order: parsed.sort_order,
    seo_title: parsed.seo_title || null,
    seo_description: parsed.seo_description || null,
    is_active: formBool(formData, "is_active"),
  };

  let industryId = id;
  if (id) {
    const { error } = await supabase.from("edoscentre_industries").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase.from("edoscentre_industries").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    industryId = data.id;
  }

  const challenges = linesToList(parsed.challenges);
  await supabase.from("edoscentre_industry_challenges").delete().eq("industry_id", industryId!);
  if (challenges.length) {
    await supabase
      .from("edoscentre_industry_challenges")
      .insert(challenges.map((challenge, i) => ({ industry_id: industryId!, challenge, sort_order: i })));
  }

  const solutions = linesToList(parsed.solutions);
  await supabase.from("edoscentre_industry_solutions").delete().eq("industry_id", industryId!);
  if (solutions.length) {
    await supabase
      .from("edoscentre_industry_solutions")
      .insert(solutions.map((solution, i) => ({ industry_id: industryId!, solution, sort_order: i })));
  }

  const outcomes = linesToList(parsed.outcomes);
  await supabase.from("edoscentre_industry_outcomes").delete().eq("industry_id", industryId!);
  if (outcomes.length) {
    await supabase
      .from("edoscentre_industry_outcomes")
      .insert(outcomes.map((outcome, i) => ({ industry_id: industryId!, outcome, sort_order: i })));
  }

  await supabase.from("edoscentre_industry_technologies").delete().eq("industry_id", industryId!);
  if (parsed.technology_ids.length) {
    await supabase.from("edoscentre_industry_technologies").insert(
      parsed.technology_ids.map((technology_id) => ({ industry_id: industryId!, technology_id })),
    );
  }

  await logAudit({ actorId: admin.id, action: id ? "industry_updated" : "industry_created", metadata: { name: parsed.name } });
  revalidatePath("/admin/websites/edos-centre/industries");
  revalidatePath("/industries");
  revalidatePath(`/industries/${payload.slug}`);
}

export async function deleteIndustry(id: string, name: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_industries").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "industry_deleted", metadata: { name } });
  revalidatePath("/admin/websites/edos-centre/industries");
  revalidatePath("/industries");
}
