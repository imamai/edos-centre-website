"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/admin/ui/Card";
import { Button } from "@/components/admin/ui/Button";
import { Drawer, ConfirmDialog } from "@/components/admin/ui/Drawer";

export interface Column<T> {
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

export interface EntityManagerProps<T> {
  title: string;
  description: string;
  newLabel?: string;
  items: T[];
  columns: Column<T>[];
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  drawerTitle: (editing: T | null) => string;
  drawerDescription?: string;
  renderFields: (editing: T | null) => ReactNode;
  onSubmit: (formData: FormData, editing: T | null) => Promise<void>;
  onDelete?: (item: T) => Promise<void>;
  emptyMessage?: string;
  headerExtra?: ReactNode;
}

export default function EntityManager<T>({
  title,
  description,
  newLabel = "New",
  items,
  columns,
  getId,
  getLabel,
  drawerTitle,
  drawerDescription,
  renderFields,
  onSubmit,
  onDelete,
  emptyMessage = "Nothing here yet.",
  headerExtra,
}: EntityManagerProps<T>) {
  const router = useRouter();
  const [editing, setEditing] = useState<T | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  function openNew() {
    setEditing(null);
    setDrawerOpen(true);
  }

  function openEdit(item: T) {
    setEditing(item);
    setDrawerOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      await onSubmit(new FormData(e.currentTarget), editing);
      toast.success("Saved.");
      setDrawerOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to save.");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget || !onDelete) return;
    setPending(true);
    try {
      await onDelete(deleteTarget);
      toast.success("Deleted.");
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to delete.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          {headerExtra}
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> {newLabel}
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
              <tr>
                {columns.map((col) => (
                  <th key={col.header} className="px-5 py-3">
                    {col.header}
                  </th>
                ))}
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-5 py-8 text-center text-slate-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={getId(item)} className="hover:bg-slate-50">
                    {columns.map((col) => (
                      <td key={col.header} className={col.className ?? "px-5 py-3 text-slate-700"}>
                        {col.render(item)}
                      </td>
                    ))}
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(item)} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                          <Pencil className="h-4 w-4" />
                        </button>
                        {onDelete && (
                          <button onClick={() => setDeleteTarget(item)} className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} title={drawerTitle(editing)} description={drawerDescription}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFields(editing)}
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

      {onDelete && (
        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          title="Delete"
          description={deleteTarget ? `Are you sure you want to delete "${getLabel(deleteTarget)}"? This cannot be undone.` : ""}
          confirmLabel="Delete"
          danger
          loading={pending}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
