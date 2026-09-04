"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { formBool } from "@/components/admin/ui/Checkbox";
import { slugify } from "@/lib/utils";

const schema = z.object({
  sub_label: z.string().min(1),
  value: z.coerce.number(),
  suffix: z.string().optional(),
  description: z.string().optional(),
  sort_order: z.coerce.number().default(0),
});

export async function upsertMetric(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = schema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();
  const payload = {
    sub_label: parsed.sub_label,
    label: `${parsed.value}${parsed.suffix ?? ""}`,
    value: parsed.value,
    suffix: parsed.suffix || "",
    description: parsed.description || null,
    sort_order: parsed.sort_order,
    is_active: formBool(formData, "is_active"),
  };

  const { error } = id
    ? await supabase.from("edoscentre_metrics").update(payload).eq("id", id)
    : await supabase.from("edoscentre_metrics").insert({ ...payload, key: slugify(parsed.sub_label).replace(/-/g, "_") });
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: id ? "metric_updated" : "metric_created", metadata: { sub_label: parsed.sub_label } });
  revalidatePath("/admin/websites/edos-centre/metrics");
  revalidatePath("/", "layout");
}

export async function deleteMetric(id: string, subLabel: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_metrics").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "metric_deleted", metadata: { sub_label: subLabel } });
  revalidatePath("/admin/websites/edos-centre/metrics");
  revalidatePath("/", "layout");
}
