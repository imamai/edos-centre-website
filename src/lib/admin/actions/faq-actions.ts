"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { formBool } from "@/components/admin/ui/Checkbox";
import { slugify } from "@/lib/utils";

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category_id: z.string().optional(),
  sort_order: z.coerce.number().default(0),
});

export async function upsertFaq(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = faqSchema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();
  const payload = {
    question: parsed.question,
    answer: parsed.answer,
    category_id: parsed.category_id || null,
    sort_order: parsed.sort_order,
    is_active: formBool(formData, "is_active"),
  };

  const { error } = id
    ? await supabase.from("edoscentre_faqs").update(payload).eq("id", id)
    : await supabase.from("edoscentre_faqs").insert(payload);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: id ? "faq_updated" : "faq_created" });
  revalidatePath("/admin/websites/edos-centre/faqs");
  revalidatePath("/", "layout");
}

export async function deleteFaq(id: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "faq_deleted" });
  revalidatePath("/admin/websites/edos-centre/faqs");
  revalidatePath("/", "layout");
}

const categorySchema = z.object({ name: z.string().min(1), sort_order: z.coerce.number().default(0) });

export async function upsertFaqCategory(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = categorySchema.parse(Object.fromEntries(formData));
  const supabase = await createServiceClient();
  const payload = { name: parsed.name, sort_order: parsed.sort_order };

  const { error } = id
    ? await supabase.from("edoscentre_faq_categories").update(payload).eq("id", id)
    : await supabase.from("edoscentre_faq_categories").insert({ ...payload, slug: slugify(parsed.name) });
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: id ? "faq_category_updated" : "faq_category_created" });
  revalidatePath("/admin/websites/edos-centre/faqs");
}

export async function deleteFaqCategory(id: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_faq_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "faq_category_deleted" });
  revalidatePath("/admin/websites/edos-centre/faqs");
}
