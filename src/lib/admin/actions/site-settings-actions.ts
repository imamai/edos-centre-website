"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.types";

const schema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  description: z.string().optional(),
});

export async function upsertSiteSetting(formData: FormData) {
  const admin = await requireAdmin("edos-centre");
  const parsed = schema.parse({
    key: formData.get("key"),
    value: formData.get("value"),
    description: formData.get("description") || undefined,
  });

  let value: Json;
  try {
    value = JSON.parse(parsed.value) as Json;
  } catch {
    value = parsed.value;
  }

  const supabase = await createServiceClient();
  const { error } = await supabase
    .from("edoscentre_site_settings")
    .upsert({ key: parsed.key, value, description: parsed.description ?? null }, { onConflict: "key" });
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "site_setting_updated", metadata: { key: parsed.key } });
  revalidatePath("/admin/websites/edos-centre/site-settings");
  revalidatePath("/", "layout");
}

export async function deleteSiteSetting(id: string, key: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_site_settings").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "site_setting_deleted", metadata: { key } });
  revalidatePath("/admin/websites/edos-centre/site-settings");
  revalidatePath("/", "layout");
}
