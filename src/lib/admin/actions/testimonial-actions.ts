"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { formBool } from "@/components/admin/ui/Checkbox";

const schema = z.object({
  client_name: z.string().min(1),
  client_title: z.string().optional(),
  client_org: z.string().optional(),
  client_photo: z.string().optional(),
  client_logo: z.string().optional(),
  quote: z.string().min(1),
  industry_id: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  sort_order: z.coerce.number().default(0),
});

export async function upsertTestimonial(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = schema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();
  const payload = {
    client_name: parsed.client_name,
    client_title: parsed.client_title || null,
    client_org: parsed.client_org || null,
    client_photo: parsed.client_photo || null,
    client_logo: parsed.client_logo || null,
    quote: parsed.quote,
    industry_id: parsed.industry_id || null,
    rating: parsed.rating ?? null,
    sort_order: parsed.sort_order,
    is_featured: formBool(formData, "is_featured"),
    is_active: formBool(formData, "is_active"),
  };

  const { error } = id
    ? await supabase.from("edoscentre_testimonials").update(payload).eq("id", id)
    : await supabase.from("edoscentre_testimonials").insert({ ...payload, case_study_id: null });
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: id ? "testimonial_updated" : "testimonial_created", metadata: { client: parsed.client_name } });
  revalidatePath("/admin/websites/edos-centre/testimonials");
  revalidatePath("/", "layout");
}

export async function deleteTestimonial(id: string, name: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "testimonial_deleted", metadata: { name } });
  revalidatePath("/admin/websites/edos-centre/testimonials");
  revalidatePath("/", "layout");
}
