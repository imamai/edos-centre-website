"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { formBool } from "@/components/admin/ui/Checkbox";

const schema = z.object({
  website_id: z.string().min(1),
  domain_id: z.string().optional(),
  provider: z.string().min(1),
  cert_type: z.enum(["free", "paid", "wildcard", "ev"]),
  issued_date: z.string().optional(),
  expiry_date: z.string().min(1),
  cost: z.string().optional(),
  currency: z.string().default("KES"),
  status: z.enum(["active", "revoked", "expired"]),
  notes: z.string().optional(),
});

export async function upsertSslCertificate(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = schema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();
  const payload = {
    website_id: parsed.website_id,
    domain_id: parsed.domain_id || null,
    provider: parsed.provider,
    cert_type: parsed.cert_type,
    issued_date: parsed.issued_date || null,
    expiry_date: parsed.expiry_date,
    auto_renew: formBool(formData, "auto_renew"),
    cost: parsed.cost ? Number(parsed.cost) : null,
    currency: parsed.currency,
    status: parsed.status,
    notes: parsed.notes || null,
  };

  const { error } = id
    ? await supabase.from("edoscentreadmin_ssl_certificates").update(payload).eq("id", id)
    : await supabase.from("edoscentreadmin_ssl_certificates").insert(payload);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: id ? "ssl_certificate_updated" : "ssl_certificate_created" });
  revalidatePath("/admin/hosting");
  revalidatePath("/admin");
}

export async function deleteSslCertificate(id: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentreadmin_ssl_certificates").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "ssl_certificate_deleted" });
  revalidatePath("/admin/hosting");
  revalidatePath("/admin");
}
