"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { formBool } from "@/components/admin/ui/Checkbox";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  monthly_price: z.coerce.number().optional(),
  quarterly_price: z.coerce.number().optional(),
  semiannual_price: z.coerce.number().optional(),
  annual_price: z.coerce.number().optional(),
  setup_fee: z.coerce.number().default(0),
  currency: z.string().default("KES"),
  features: z.string().optional(),
  sort_order: z.coerce.number().default(0),
});

export async function upsertPlan(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = schema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();
  const payload = {
    name: parsed.name,
    description: parsed.description || null,
    monthly_price: parsed.monthly_price ?? null,
    quarterly_price: parsed.quarterly_price ?? null,
    semiannual_price: parsed.semiannual_price ?? null,
    annual_price: parsed.annual_price ?? null,
    setup_fee: parsed.setup_fee,
    currency: parsed.currency,
    features: parsed.features || null,
    sort_order: parsed.sort_order,
    is_active: formBool(formData, "is_active"),
  };

  const { error } = id
    ? await supabase.from("edoscentreadmin_subscription_plans").update(payload).eq("id", id)
    : await supabase.from("edoscentreadmin_subscription_plans").insert(payload);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: id ? "plan_updated" : "plan_created", metadata: { name: parsed.name } });
  revalidatePath("/admin/subscriptions");
}

export async function deletePlan(id: string, name: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentreadmin_subscription_plans").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "plan_deleted", metadata: { name } });
  revalidatePath("/admin/subscriptions");
}
