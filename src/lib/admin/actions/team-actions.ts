"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";
import { formBool } from "@/components/admin/ui/Checkbox";

const schema = z.object({
  full_name: z.string().min(1),
  job_title: z.string().min(1),
  department: z.string().optional(),
  bio: z.string().optional(),
  photo_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  twitter_url: z.string().optional(),
  github_url: z.string().optional(),
  sort_order: z.coerce.number().default(0),
});

export async function upsertTeamMember(formData: FormData, id?: string) {
  const admin = await requireAdmin("edos-centre");
  const parsed = schema.parse(Object.fromEntries(formData));

  const supabase = await createServiceClient();
  const payload = {
    full_name: parsed.full_name,
    job_title: parsed.job_title,
    department: parsed.department || null,
    bio: parsed.bio || null,
    photo_url: parsed.photo_url || null,
    linkedin_url: parsed.linkedin_url || null,
    twitter_url: parsed.twitter_url || null,
    github_url: parsed.github_url || null,
    sort_order: parsed.sort_order,
    is_leadership: formBool(formData, "is_leadership"),
    is_active: formBool(formData, "is_active"),
  };

  const { error } = id
    ? await supabase.from("edoscentre_team_members").update(payload).eq("id", id)
    : await supabase.from("edoscentre_team_members").insert({ ...payload, profile_id: null });
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: id ? "team_member_updated" : "team_member_created", metadata: { name: parsed.full_name } });
  revalidatePath("/admin/websites/edos-centre/team");
  revalidatePath("/about");
}

export async function deleteTeamMember(id: string, name: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_team_members").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "team_member_deleted", metadata: { name } });
  revalidatePath("/admin/websites/edos-centre/team");
  revalidatePath("/about");
}
