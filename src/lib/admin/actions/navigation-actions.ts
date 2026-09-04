"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { formBool } from "@/components/admin/ui/Checkbox";

const schema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  parent_id: z.string().optional(),
  menu_slot: z.string().min(1),
  sort_order: z.coerce.number().default(0),
});

export async function upsertNavigationItem(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = schema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();
  const payload = {
    label: parsed.label,
    href: parsed.href,
    parent_id: parsed.parent_id || null,
    menu_slot: parsed.menu_slot,
    sort_order: parsed.sort_order,
    is_active: formBool(formData, "is_active"),
    open_in_new: formBool(formData, "open_in_new"),
  };

  const { error } = id
    ? await supabase.from("edoscentre_navigation_items").update(payload).eq("id", id)
    : await supabase.from("edoscentre_navigation_items").insert(payload);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: id ? "nav_item_updated" : "nav_item_created", metadata: { label: parsed.label } });
  revalidatePath("/admin/websites/edos-centre/navigation");
  revalidatePath("/", "layout");
}

export async function deleteNavigationItem(id: string, label: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_navigation_items").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "nav_item_deleted", metadata: { label } });
  revalidatePath("/admin/websites/edos-centre/navigation");
  revalidatePath("/", "layout");
}
