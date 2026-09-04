"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, Trash2, Copy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/admin/ui/Card";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { ConfirmDialog } from "@/components/admin/ui/Drawer";
import { recordMediaUpload, updateMediaAlt, deleteMediaAsset } from "@/lib/admin/actions/media-actions";
import type { Database } from "@/types/database.types";

type MediaAsset = Database["public"]["Tables"]["edoscentre_media_assets"]["Row"];

export default function MediaLibrary({ assets }: { assets: MediaAsset[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [pending, setPending] = useState(false);

  async function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const supabase = createClient();

    for (const file of files) {
      try {
        const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { error: uploadError } = await supabase.storage.from("edoscentre-media").upload(path, file);
        if (uploadError) throw uploadError;

        const { data: pub } = supabase.storage.from("edoscentre-media").getPublicUrl(path);
        await recordMediaUpload({
          storage_path: path,
          public_url: pub.publicUrl,
          file_size: file.size,
          mime_type: file.type,
        });
        toast.success(`Uploaded ${file.name}.`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : `Failed to upload ${file.name}.`);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  async function onSaveAlt(asset: MediaAsset, value: string) {
    try {
      await updateMediaAlt(asset.id, value);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to update alt text.");
    }
  }

  async function onDelete() {
    if (!deleteTarget) return;
    setPending(true);
    try {
      await deleteMediaAsset(deleteTarget.id, deleteTarget.storage_path);
      toast.success("Deleted.");
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to delete.");
    } finally {
      setPending(false);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copied.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Media Library</h1>
          <p className="mt-1 text-sm text-slate-500">Images and files used across the EDOS Centre site.</p>
        </div>
        <div>
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={onFilesSelected} />
          <Button onClick={() => fileInputRef.current?.click()} loading={uploading}>
            <Upload className="h-4 w-4" /> Upload
          </Button>
        </div>
      </div>

      {assets.length === 0 ? (
        <Card className="p-12 text-center text-slate-400">No media uploaded yet.</Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset.public_url} alt={asset.alt_text ?? ""} className="aspect-square w-full object-cover" />
              <div className="space-y-2 p-3">
                <Input
                  defaultValue={asset.alt_text ?? ""}
                  placeholder="Alt text"
                  className="text-xs"
                  onBlur={(e) => e.target.value !== (asset.alt_text ?? "") && onSaveAlt(asset, e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <button onClick={() => copyUrl(asset.public_url)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
                    <Copy className="h-3 w-3" /> Copy URL
                  </button>
                  <button onClick={() => setDeleteTarget(asset)} className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete media"
        description="This will permanently remove the file from storage. This cannot be undone."
        confirmLabel="Delete"
        danger
        loading={pending}
        onConfirm={onDelete}
      />
    </div>
  );
}
