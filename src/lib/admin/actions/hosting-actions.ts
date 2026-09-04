"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { formBool } from "@/components/admin/ui/Checkbox";

const schema = z.object({
  website_id: z.string().min(1),
  provider: z.string().min(1),
  plan: z.string().optional(),
  server_ip: z.string().optional(),
  control_panel_url: z.string().optional(),
  storage_limit_gb: z.string().optional(),
  bandwidth_limit_gb: z.string().optional(),
  renewal_date: z.string().optional(),
  cost: z.string().optional(),
  currency: z.string().default("KES"),
  notes: z.string().optional(),
});

export async function upsertHostingDetail(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = schema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();
  const payload = {
    website_id: parsed.website_id,
    provider: parsed.provider,
    plan: parsed.plan || null,
    server_ip: parsed.server_ip || null,
    control_panel_url: parsed.control_panel_url || null,
    storage_limit_gb: parsed.storage_limit_gb ? Number(parsed.storage_limit_gb) : null,
    bandwidth_limit_gb: parsed.bandwidth_limit_gb ? Number(parsed.bandwidth_limit_gb) : null,
    renewal_date: parsed.renewal_date || null,
    cost: parsed.cost ? Number(parsed.cost) : null,
    currency: parsed.currency,
    auto_renew: formBool(formData, "auto_renew"),
    notes: parsed.notes || null,
  };

  const { error } = id
    ? await supabase.from("edoscentreadmin_hosting_details").update(payload).eq("id", id)
    : await supabase.from("edoscentreadmin_hosting_details").insert(payload);
  if (error) {
    if (error.code === "23505") throw new Error("This website already has a hosting record — edit it instead of adding another.");
    throw new Error(error.message);
  }

  await logAudit({ actorId: admin.id, action: id ? "hosting_detail_updated" : "hosting_detail_created" });
  revalidatePath("/admin/hosting");
  revalidatePath("/admin");
}

export async function deleteHostingDetail(id: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentreadmin_hosting_details").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "hosting_detail_deleted" });
  revalidatePath("/admin/hosting");
}
