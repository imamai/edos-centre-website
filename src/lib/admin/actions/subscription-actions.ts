"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { formBool } from "@/components/admin/ui/Checkbox";

const schema = z.object({
  website_id: z.string().min(1),
  client_id: z.string().min(1),
  plan_id: z.string().optional(),
  billing_cycle: z.enum(["monthly", "quarterly", "semiannual", "annual", "custom"]),
  amount: z.coerce.number().min(0),
  currency: z.string().default("KES"),
  status: z.enum(["trial", "active", "due_soon", "grace_period", "overdue", "suspended", "cancelled", "expired"]),
  start_date: z.string().min(1),
  renewal_date: z.string().optional(),
  grace_period_days: z.coerce.number().default(7),
  notes: z.string().optional(),
});

export async function upsertSubscription(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = schema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();
  const payload = {
    website_id: parsed.website_id,
    client_id: parsed.client_id,
    plan_id: parsed.plan_id || null,
    billing_cycle: parsed.billing_cycle,
    amount: parsed.amount,
    currency: parsed.currency,
    status: parsed.status,
    start_date: parsed.start_date,
    renewal_date: parsed.renewal_date || null,
    grace_period_days: parsed.grace_period_days,
    auto_renew: formBool(formData, "auto_renew"),
    notes: parsed.notes || null,
  };

  const { error } = id
    ? await supabase.from("edoscentreadmin_subscriptions").update(payload).eq("id", id)
    : await supabase.from("edoscentreadmin_subscriptions").insert(payload);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: id ? "subscription_updated" : "subscription_created" });
  revalidatePath("/admin/subscriptions");
  revalidatePath("/admin");
}

export async function deleteSubscription(id: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentreadmin_subscriptions").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "subscription_deleted" });
  revalidatePath("/admin/subscriptions");
}
