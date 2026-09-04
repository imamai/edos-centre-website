"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { formBool } from "@/components/admin/ui/Checkbox";

const schema = z.object({
  website_id: z.string().min(1),
  domain_name: z.string().min(1),
  registrar: z.string().optional(),
  registered_date: z.string().optional(),
  expiry_date: z.string().min(1),
  nameservers: z.string().optional(),
  cost: z.string().optional(),
  currency: z.string().default("KES"),
  status: z.enum(["active", "transferred_out", "cancelled"]),
  notes: z.string().optional(),
});

export async function upsertDomain(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = schema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();
  const payload = {
    website_id: parsed.website_id,
    domain_name: parsed.domain_name,
    registrar: parsed.registrar || null,
    registered_date: parsed.registered_date || null,
    expiry_date: parsed.expiry_date,
    auto_renew: formBool(formData, "auto_renew"),
    nameservers: parsed.nameservers || null,
    cost: parsed.cost ? Number(parsed.cost) : null,
    currency: parsed.currency,
    status: parsed.status,
    notes: parsed.notes || null,
  };

  const { error } = id
    ? await supabase.from("edoscentreadmin_domains").update(payload).eq("id", id)
    : await supabase.from("edoscentreadmin_domains").insert(payload);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: id ? "domain_updated" : "domain_created", metadata: { domain: parsed.domain_name } });
  revalidatePath("/admin/hosting");
  revalidatePath("/admin");
}

export async function deleteDomain(id: string, domainName: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentreadmin_domains").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "domain_deleted", metadata: { domain: domainName } });
  revalidatePath("/admin/hosting");
  revalidatePath("/admin");
}
