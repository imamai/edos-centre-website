"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";
import { createServiceClient } from "@/lib/supabase/server";

const recordSchema = z.object({
  storage_path: z.string().min(1),
  public_url: z.string().min(1),
  alt_text: z.string().optional(),
  file_size: z.coerce.number().optional(),
  mime_type: z.string().optional(),
});

/** Called after the browser has already uploaded the file straight to Storage. */
export async function recordMediaUpload(input: z.infer<typeof recordSchema>) {
  const admin = await requireAdmin("edos-centre");
  const parsed = recordSchema.parse(input);

  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_media_assets").insert({
    bucket: "edoscentre-media",
    storage_path: parsed.storage_path,
    public_url: parsed.public_url,
    alt_text: parsed.alt_text || null,
    width: null,
    height: null,
    file_size: parsed.file_size ?? null,
    mime_type: parsed.mime_type ?? null,
    uploaded_by: admin.id,
  });
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "media_uploaded", metadata: { path: parsed.storage_path } });
  revalidatePath("/admin/websites/edos-centre/media");
}

export async function updateMediaAlt(id: string, altText: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();
  const { error } = await supabase.from("edoscentre_media_assets").update({ alt_text: altText || null }).eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "media_updated", metadata: { id } });
  revalidatePath("/admin/websites/edos-centre/media");
}

export async function deleteMediaAsset(id: string, storagePath: string) {
  const admin = await requireAdmin("edos-centre");
  const supabase = await createServiceClient();

  await supabase.storage.from("edoscentre-media").remove([storagePath]);
  const { error } = await supabase.from("edoscentre_media_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit({ actorId: admin.id, action: "media_deleted", metadata: { path: storagePath } });
  revalidatePath("/admin/websites/edos-centre/media");
}
