"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";

async function setWebsiteStatus(
  websiteId: string,
  websiteSlug: string,
  fields: { status: string; status_reason: string | null; status_message: string | null; maintenance_return_at: string | null },
  action: string,
) {
  const admin = await requireAdmin(websiteSlug);
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from("edoscentreadmin_websites")
    .update({ ...fields, status_changed_at: new Date().toISOString(), status_changed_by: admin.id })
    .eq("id", websiteId);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action, websiteId, metadata: fields });
  revalidatePath("/admin/websites");
  revalidatePath(`/admin/websites/${websiteSlug}`);
  revalidatePath("/", "layout");
}

const suspendSchema = z.object({ reason: z.string().min(1), message: z.string().optional() });

export async function suspendWebsite(websiteId: string, websiteSlug: string, formData: FormData) {
  const parsed = suspendSchema.parse(Object.fromEntries(formData));
  await setWebsiteStatus(
    websiteId,
    websiteSlug,
    { status: "suspended", status_reason: parsed.reason, status_message: parsed.message || null, maintenance_return_at: null },
    "website_suspended",
  );
}

export async function activateWebsite(websiteId: string, websiteSlug: string) {
  await setWebsiteStatus(
    websiteId,
    websiteSlug,
    { status: "active", status_reason: null, status_message: null, maintenance_return_at: null },
    "website_activated",
  );
}

const maintenanceSchema = z.object({ message: z.string().optional(), return_at: z.string().optional() });

export async function setMaintenanceMode(websiteId: string, websiteSlug: string, formData: FormData) {
  const parsed = maintenanceSchema.parse(Object.fromEntries(formData));
  await setWebsiteStatus(
    websiteId,
    websiteSlug,
    {
      status: "maintenance",
      status_reason: "Maintenance",
      status_message: parsed.message || null,
      maintenance_return_at: parsed.return_at ? new Date(parsed.return_at).toISOString() : null,
    },
    "website_maintenance_enabled",
  );
}
