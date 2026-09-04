"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { formBool } from "@/components/admin/ui/Checkbox";

const schema = z.object({
  layer_number: z.coerce.number(),
  name: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  example: z.string().optional(),
  icon: z.string().optional(),
  color_hex: z.string().min(1),
  sort_order: z.coerce.number().default(0),
  tools: z.string().optional(),
});

function linesToList(value?: string): string[] {
  return (value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export async function upsertPlatformLayer(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = schema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();
  const payload = {
    layer_number: parsed.layer_number,
    name: parsed.name,
    subtitle: parsed.subtitle || null,
    description: parsed.description || null,
    example: parsed.example || null,
    icon: parsed.icon || null,
    color_hex: parsed.color_hex,
    sort_order: parsed.sort_order,
    is_active: formBool(formData, "is_active"),
  };

  let layerId = id;
  if (id) {
    const { error } = await supabase.from("edoscentre_platform_layers").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase.from("edoscentre_platform_layers").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    layerId = data.id;
  }

  const tools = linesToList(parsed.tools);
  await supabase.from("edoscentre_platform_layer_tools").delete().eq("layer_id", layerId!);
  if (tools.length) {
    await supabase.from("edoscentre_platform_layer_tools").insert(
      tools.map((custom_name, i) => ({ layer_id: layerId!, technology_id: null, custom_name, custom_icon: null, sort_order: i })),
    );
  }

  await logAudit({ actorId: admin.id, action: id ? "platform_layer_updated" : "platform_layer_created", metadata: { name: parsed.name } });
  revalidatePath("/admin/websites/edos-centre/platform-layers");
  revalidatePath("/", "layout");
}

export async function deletePlatformLayer(id: string, name: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_platform_layers").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "platform_layer_deleted", metadata: { name } });
  revalidatePath("/admin/websites/edos-centre/platform-layers");
  revalidatePath("/", "layout");
}
