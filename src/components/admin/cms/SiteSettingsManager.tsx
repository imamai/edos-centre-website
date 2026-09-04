"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/admin/ui/Card";
import { Button } from "@/components/admin/ui/Button";
import { Input, Textarea, Label } from "@/components/admin/ui/Input";
import { Drawer, ConfirmDialog } from "@/components/admin/ui/Drawer";
import { upsertSiteSetting, deleteSiteSetting } from "@/lib/admin/actions/site-settings-actions";
import type { Database } from "@/types/database.types";

type SiteSetting = Database["public"]["Tables"]["edoscentre_site_settings"]["Row"];

export default function SiteSettingsManager({ settings }: { settings: SiteSetting[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<SiteSetting | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SiteSetting | null>(null);

  function openNew() {
    setEditing(null);
    setDrawerOpen(true);
  }

  function openEdit(setting: SiteSetting) {
    setEditing(setting);
    setDrawerOpen(true);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      await upsertSiteSetting(new FormData(e.currentTarget));
      toast.success("Setting saved.");
      setDrawerOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to save setting.");
    } finally {
      setPending(false);
    }
  }

  async function onDelete() {
    if (!deleteTarget) return;
    setPending(true);
    try {
      await deleteSiteSetting(deleteTarget.id, deleteTarget.key);
      toast.success("Setting deleted.");
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to delete setting.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Site Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Key/value configuration used across the EDOS Centre site.</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New setting
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Key</th>
                <th className="px-5 py-3">Value</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                    No settings yet.
                  </td>
                </tr>
              ) : (
                settings.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs text-slate-700">{s.key}</td>
                    <td className="max-w-xs truncate px-5 py-3 text-slate-600">{JSON.stringify(s.value)}</td>
                    <td className="px-5 py-3 text-slate-400">{s.description ?? "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(s)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(s)} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={editing ? "Edit setting" : "New setting"}
        description="Value must be valid JSON (e.g. a quoted string, number, or object)."
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="key">Key</Label>
            <Input
              id="key"
              name="key"
              required
              defaultValue={editing?.key}
              readOnly={!!editing}
              className={editing ? "bg-slate-50 text-slate-500" : undefined}
            />
          </div>
          <div>
            <Label htmlFor="value">Value (JSON)</Label>
            <Textarea
              id="value"
              name="value"
              required
              defaultValue={editing ? JSON.stringify(editing.value, null, 2) : ""}
              className="font-mono text-xs"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" defaultValue={editing?.description ?? ""} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={pending}>
              Save
            </Button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete setting"
        description={`Are you sure you want to delete "${deleteTarget?.key}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={pending}
        onConfirm={onDelete}
      />
    </div>
  );
}
