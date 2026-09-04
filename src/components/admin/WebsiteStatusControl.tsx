"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldAlert, PlayCircle, Wrench } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { Input, Textarea, Label, Select } from "@/components/admin/ui/Input";
import { Drawer, ConfirmDialog } from "@/components/admin/ui/Drawer";
import { suspendWebsite, activateWebsite, setMaintenanceMode } from "@/lib/admin/actions/website-status-actions";
import type { AdminWebsite } from "@/types/database.types";

const SUSPEND_REASONS = [
  "Subscription expired",
  "Invoice overdue",
  "Hosting payment overdue",
  "Client requested suspension",
  "Security issue",
  "Administrative suspension",
  "Other",
];

export default function WebsiteStatusControl({ website }: { website: AdminWebsite }) {
  const router = useRouter();
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [activateConfirmOpen, setActivateConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSuspend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      await suspendWebsite(website.id, website.slug, new FormData(e.currentTarget));
      toast.success("Website suspended.");
      setSuspendOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to suspend website.");
    } finally {
      setPending(false);
    }
  }

  async function onMaintenance(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      await setMaintenanceMode(website.id, website.slug, new FormData(e.currentTarget));
      toast.success("Maintenance mode enabled.");
      setMaintenanceOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to enable maintenance mode.");
    } finally {
      setPending(false);
    }
  }

  async function onActivate() {
    setPending(true);
    try {
      await activateWebsite(website.id, website.slug);
      toast.success("Website activated.");
      setActivateConfirmOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to activate website.");
    } finally {
      setPending(false);
    }
  }

  const isActive = website.status === "active";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">Website status</span>
            <StatusBadge status={website.status} />
          </div>
          {website.status_reason && (
            <p className="mt-1 text-sm text-slate-500">
              {website.status_reason}
              {website.status_message && ` — ${website.status_message}`}
            </p>
          )}
          {website.maintenance_return_at && (
            <p className="mt-1 text-xs text-slate-400">Expected back: {new Date(website.maintenance_return_at).toLocaleString()}</p>
          )}
        </div>

        <div className="flex gap-2">
          {isActive ? (
            <>
              <Button variant="secondary" onClick={() => setMaintenanceOpen(true)}>
                <Wrench className="h-4 w-4" /> Maintenance mode
              </Button>
              <Button variant="danger" onClick={() => setSuspendOpen(true)}>
                <ShieldAlert className="h-4 w-4" /> Suspend website
              </Button>
            </>
          ) : (
            <Button onClick={() => setActivateConfirmOpen(true)}>
              <PlayCircle className="h-4 w-4" /> Activate website
            </Button>
          )}
        </div>
      </div>

      <Drawer open={suspendOpen} onOpenChange={setSuspendOpen} title="Suspend website" description="The public site will show a suspension page until reactivated. Admin access and all data remain intact.">
        <form onSubmit={onSuspend} className="space-y-4">
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Select id="reason" name="reason" required defaultValue="">
              <option value="" disabled>
                Select a reason
              </option>
              {SUSPEND_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="message">Message shown to visitors (optional)</Label>
            <Textarea id="message" name="message" placeholder="We'll be back shortly." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setSuspendOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" loading={pending}>
              Suspend website
            </Button>
          </div>
        </form>
      </Drawer>

      <Drawer open={maintenanceOpen} onOpenChange={setMaintenanceOpen} title="Enable maintenance mode" description="The public site will show a maintenance page. Admin access remains available.">
        <form onSubmit={onMaintenance} className="space-y-4">
          <div>
            <Label htmlFor="message">Message shown to visitors</Label>
            <Textarea id="message" name="message" placeholder="We are currently performing scheduled maintenance. Please check back shortly." />
          </div>
          <div>
            <Label htmlFor="return_at">Expected return (optional)</Label>
            <Input id="return_at" name="return_at" type="datetime-local" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setMaintenanceOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={pending}>
              Enable maintenance mode
            </Button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={activateConfirmOpen}
        onOpenChange={setActivateConfirmOpen}
        title="Activate website"
        description="This restores public access immediately."
        confirmLabel="Activate"
        loading={pending}
        onConfirm={onActivate}
      />
    </div>
  );
}
