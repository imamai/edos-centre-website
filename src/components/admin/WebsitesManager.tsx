"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import EntityManager from "@/components/admin/cms/EntityManager";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { Input, Textarea, Label, Select } from "@/components/admin/ui/Input";
import { upsertWebsite, deleteWebsite } from "@/lib/admin/actions/website-actions";
import type { AdminWebsite, WebsiteStatus } from "@/types/database.types";

const STATUSES: WebsiteStatus[] = ["active", "trial", "pending", "suspended", "maintenance", "expired", "archived"];

export default function WebsitesManager({ websites }: { websites: AdminWebsite[] }) {
  return (
    <EntityManager<AdminWebsite>
      title="Websites"
      description="Every site and digital system managed from this platform. Onboarding here registers a website for billing, hosting/domain/SSL tracking, status control and client portal access — it does not give it a content-management area of its own (that's built per-site, like the EDOS Centre CMS)."
      newLabel="New website"
      items={websites}
      getId={(w) => w.id}
      getLabel={(w) => w.name}
      drawerTitle={(editing) => (editing ? `Edit ${editing.name}` : "Onboard a new website")}
      columns={[
        { header: "Website", render: (w) => <Link href={`/admin/websites/${w.slug}`} className="font-medium text-slate-900 hover:underline" onClick={(e) => e.stopPropagation()}>{w.name}</Link> },
        { header: "Domain", render: (w) => w.domain ?? "—" },
        { header: "Status", render: (w) => <StatusBadge status={w.status} /> },
        {
          header: "",
          render: (w) => (
            <Link href={`/admin/websites/${w.slug}`} className="inline-flex items-center text-slate-400 hover:text-slate-700" onClick={(e) => e.stopPropagation()}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ),
        },
      ]}
      renderFields={(editing) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={editing?.name} placeholder="Mejasan Media" />
            </div>
            <div>
              <Label htmlFor="slug">Slug (used in URLs, auto-generated from name if left blank)</Label>
              <Input id="slug" name="slug" defaultValue={editing?.slug ?? ""} placeholder="mejasan-media" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input id="domain" name="domain" defaultValue={editing?.domain ?? ""} placeholder="mejasanmedia.com" />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={editing?.status ?? "active"}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="primary_admin_email">Primary admin email</Label>
            <Input id="primary_admin_email" name="primary_admin_email" type="email" defaultValue={editing?.primary_admin_email ?? ""} />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" defaultValue={editing?.notes ?? ""} />
          </div>
        </>
      )}
      onSubmit={async (formData, editing) => upsertWebsite(formData, editing?.id)}
      onDelete={async (w) => deleteWebsite(w.id, w.name)}
      emptyMessage="No websites onboarded yet."
    />
  );
}
