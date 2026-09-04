"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";

const schema = z.object({
  company_name: z.string().min(1),
  contact_person: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export async function upsertClient(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = schema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();
  const payload = {
    company_name: parsed.company_name,
    contact_person: parsed.contact_person || null,
    email: parsed.email || null,
    phone: parsed.phone || null,
    address: parsed.address || null,
    notes: parsed.notes || null,
  };

  const { error } = id
    ? await supabase.from("edoscentreadmin_clients").update(payload).eq("id", id)
    : await supabase.from("edoscentreadmin_clients").insert(payload);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: id ? "client_updated" : "client_created", metadata: { name: parsed.company_name } });
  revalidatePath("/admin/clients");
}

export async function deleteClient(id: string, name: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentreadmin_clients").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "client_deleted", metadata: { name } });
  revalidatePath("/admin/clients");
}
