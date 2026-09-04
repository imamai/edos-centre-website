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
  client_name: z.string().optional(),
  client_logo_url: z.string().optional(),
  industry_id: z.string().optional(),
  tagline: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  impact: z.string().optional(),
  cover_image_url: z.string().optional(),
  result_summary: z.string().optional(),
  duration: z.string().optional(),
  project_year: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  kpis: z.string().optional(),
  technology_ids: z.array(z.string()).default([]),
});

function parseKpis(value?: string) {
  return (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [metric_label, metric_value, metric_unit] = line.split("|").map((p) => p.trim());
      return { metric_label: metric_label || "", metric_value: metric_value || "", metric_unit: metric_unit || null };
    })
    .filter((k) => k.metric_label && k.metric_value);
}

export async function upsertCaseStudy(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const raw = Object.fromEntries(formData);
  const parsed = schema.parse({ ...raw, technology_ids: formData.getAll("technology_ids") });

  const supabase = await createServiceClient();
  const isPublished = formBool(formData, "is_published");
  const payload = {
    title: parsed.title,
    slug: slugify(parsed.title),
    client_name: parsed.client_name || null,
    client_logo_url: parsed.client_logo_url || null,
    industry_id: parsed.industry_id || null,
    tagline: parsed.tagline || null,
    challenge: parsed.challenge || null,
    solution: parsed.solution || null,
    impact: parsed.impact || null,
    cover_image_url: parsed.cover_image_url || null,
    result_summary: parsed.result_summary || null,
    duration: parsed.duration || null,
    project_year: parsed.project_year || null,
    sort_order: parsed.sort_order,
    seo_title: parsed.seo_title || null,
    seo_description: parsed.seo_description || null,
    is_featured: formBool(formData, "is_featured"),
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  };

  let caseStudyId = id;
  if (id) {
    const { error } = await supabase.from("edoscentre_case_studies").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase.from("edoscentre_case_studies").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    caseStudyId = data.id;
  }

  await supabase.from("edoscentre_case_study_kpis").delete().eq("case_study_id", caseStudyId!);
  const kpis = parseKpis(parsed.kpis);
  if (kpis.length) {
    await supabase.from("edoscentre_case_study_kpis").insert(
      kpis.map((k, i) => ({ case_study_id: caseStudyId!, ...k, sort_order: i })),
    );
  }

  await supabase.from("edoscentre_case_study_technologies").delete().eq("case_study_id", caseStudyId!);
  if (parsed.technology_ids.length) {
    await supabase.from("edoscentre_case_study_technologies").insert(
      parsed.technology_ids.map((technology_id) => ({ case_study_id: caseStudyId!, technology_id })),
    );
  }

  await logAudit({ actorId: admin.id, action: id ? "case_study_updated" : "case_study_created", metadata: { title: parsed.title } });
  revalidatePath("/admin/websites/edos-centre/case-studies");
  revalidatePath("/case-studies");
  revalidatePath(`/case-studies/${payload.slug}`);
}

export async function deleteCaseStudy(id: string, title: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_case_studies").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "case_study_deleted", metadata: { title } });
  revalidatePath("/admin/websites/edos-centre/case-studies");
  revalidatePath("/case-studies");
}
