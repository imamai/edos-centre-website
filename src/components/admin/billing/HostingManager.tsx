"use client";

import EntityManager from "@/components/admin/cms/EntityManager";
import { ExpiryBadge, StatusBadge } from "@/components/admin/ui/Badge";
import { Input, Textarea, Label, Select } from "@/components/admin/ui/Input";
import { Checkbox } from "@/components/admin/ui/Checkbox";
import { upsertHostingDetail, deleteHostingDetail } from "@/lib/admin/actions/hosting-actions";
import { upsertDomain, deleteDomain } from "@/lib/admin/actions/domain-actions";
import { upsertSslCertificate, deleteSslCertificate } from "@/lib/admin/actions/ssl-actions";
import type { Database } from "@/types/database.types";
import type { HostingDetailWithWebsite, DomainWithWebsite, SslCertificateWithRelations } from "@/lib/admin/queries";

type Website = Database["public"]["Tables"]["edoscentreadmin_websites"]["Row"];

const DOMAIN_STATUSES = ["active", "transferred_out", "cancelled"];
const CERT_TYPES = ["free", "paid", "wildcard", "ev"];
const CERT_STATUSES = ["active", "revoked", "expired"];

function WebsiteSelect({ websites, defaultValue }: { websites: Website[]; defaultValue?: string }) {
  return (
    <Select id="website_id" name="website_id" required defaultValue={defaultValue ?? ""}>
      <option value="" disabled>
        Select website
      </option>
      {websites.map((w) => (
        <option key={w.id} value={w.id}>
          {w.name}
        </option>
      ))}
    </Select>
  );
}

export default function HostingManager({
  hostingDetails,
  domains,
  sslCertificates,
  websites,
}: {
  hostingDetails: HostingDetailWithWebsite[];
  domains: DomainWithWebsite[];
  sslCertificates: SslCertificateWithRelations[];
  websites: Website[];
}) {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Hosting &amp; Domains</h1>
        <p className="mt-1 text-sm text-slate-500">Hosting accounts, domain registrations and SSL certificates for every website — nothing here is fabricated, expiry badges are computed live from the dates you enter.</p>
      </div>

      <EntityManager<HostingDetailWithWebsite>
        title="Hosting accounts"
        description="One hosting account per website."
        newLabel="New hosting record"
        items={hostingDetails}
        getId={(h) => h.id}
        getLabel={(h) => `${h.provider} — ${h.edoscentreadmin_websites?.name ?? "—"}`}
        drawerTitle={(editing) => (editing ? `Edit hosting — ${editing.provider}` : "New hosting record")}
        columns={[
          { header: "Website", render: (h) => h.edoscentreadmin_websites?.name ?? "—" },
          { header: "Provider", render: (h) => h.provider },
          { header: "Plan", render: (h) => h.plan ?? "—" },
          { header: "Renewal", render: (h) => (h.renewal_date ? <ExpiryBadge date={h.renewal_date} /> : "—") },
        ]}
        renderFields={(editing) => (
          <>
            <div>
              <Label htmlFor="website_id">Website</Label>
              <WebsiteSelect websites={websites} defaultValue={editing?.website_id} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="provider">Provider</Label>
                <Input id="provider" name="provider" required placeholder="e.g. DigitalOcean, cPanel host" defaultValue={editing?.provider ?? ""} />
              </div>
              <div>
                <Label htmlFor="plan">Plan</Label>
                <Input id="plan" name="plan" defaultValue={editing?.plan ?? ""} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="server_ip">Server IP</Label>
                <Input id="server_ip" name="server_ip" defaultValue={editing?.server_ip ?? ""} />
              </div>
              <div>
                <Label htmlFor="control_panel_url">Control panel URL</Label>
                <Input id="control_panel_url" name="control_panel_url" defaultValue={editing?.control_panel_url ?? ""} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="storage_limit_gb">Storage limit (GB)</Label>
                <Input id="storage_limit_gb" name="storage_limit_gb" type="number" step="0.1" defaultValue={editing?.storage_limit_gb ?? ""} />
              </div>
              <div>
                <Label htmlFor="bandwidth_limit_gb">Bandwidth limit (GB)</Label>
                <Input id="bandwidth_limit_gb" name="bandwidth_limit_gb" type="number" step="0.1" defaultValue={editing?.bandwidth_limit_gb ?? ""} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="renewal_date">Renewal date</Label>
                <Input id="renewal_date" name="renewal_date" type="date" defaultValue={editing?.renewal_date ?? ""} />
              </div>
              <div>
                <Label htmlFor="cost">Cost</Label>
                <Input id="cost" name="cost" type="number" step="0.01" defaultValue={editing?.cost ?? ""} />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" name="currency" defaultValue={editing?.currency ?? "KES"} />
              </div>
            </div>
            <Checkbox id="auto_renew" name="auto_renew" label="Auto-renews" defaultChecked={editing?.auto_renew ?? true} />
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" defaultValue={editing?.notes ?? ""} />
            </div>
          </>
        )}
        onSubmit={async (formData, editing) => upsertHostingDetail(formData, editing?.id)}
        onDelete={async (h) => deleteHostingDetail(h.id)}
        emptyMessage="No hosting accounts recorded yet."
      />

      <EntityManager<DomainWithWebsite>
        title="Domains"
        description="Every domain registration and its renewal date."
        newLabel="New domain"
        items={domains}
        getId={(d) => d.id}
        getLabel={(d) => d.domain_name}
        drawerTitle={(editing) => (editing ? `Edit ${editing.domain_name}` : "New domain")}
        columns={[
          { header: "Domain", render: (d) => <span className="font-medium text-slate-900">{d.domain_name}</span> },
          { header: "Website", render: (d) => d.edoscentreadmin_websites?.name ?? "—" },
          { header: "Registrar", render: (d) => d.registrar ?? "—" },
          { header: "Expiry", render: (d) => (d.status === "active" ? <ExpiryBadge date={d.expiry_date} /> : <StatusBadge status={d.status} />) },
        ]}
        renderFields={(editing) => (
          <>
            <div>
              <Label htmlFor="website_id">Website</Label>
              <WebsiteSelect websites={websites} defaultValue={editing?.website_id} />
            </div>
            <div>
              <Label htmlFor="domain_name">Domain name</Label>
              <Input id="domain_name" name="domain_name" required placeholder="example.co.ke" defaultValue={editing?.domain_name ?? ""} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="registrar">Registrar</Label>
                <Input id="registrar" name="registrar" placeholder="e.g. Truehost, Namecheap" defaultValue={editing?.registrar ?? ""} />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select id="status" name="status" defaultValue={editing?.status ?? "active"}>
                  {DOMAIN_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="registered_date">Registered date</Label>
                <Input id="registered_date" name="registered_date" type="date" defaultValue={editing?.registered_date ?? ""} />
              </div>
              <div>
                <Label htmlFor="expiry_date">Expiry date</Label>
                <Input id="expiry_date" name="expiry_date" type="date" required defaultValue={editing?.expiry_date ?? ""} />
              </div>
            </div>
            <div>
              <Label htmlFor="nameservers">Nameservers</Label>
              <Input id="nameservers" name="nameservers" placeholder="ns1.example.com, ns2.example.com" defaultValue={editing?.nameservers ?? ""} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="cost">Cost</Label>
                <Input id="cost" name="cost" type="number" step="0.01" defaultValue={editing?.cost ?? ""} />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" name="currency" defaultValue={editing?.currency ?? "KES"} />
              </div>
            </div>
            <Checkbox id="auto_renew" name="auto_renew" label="Auto-renews" defaultChecked={editing?.auto_renew ?? true} />
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" defaultValue={editing?.notes ?? ""} />
            </div>
          </>
        )}
        onSubmit={async (formData, editing) => upsertDomain(formData, editing?.id)}
        onDelete={async (d) => deleteDomain(d.id, d.domain_name)}
        emptyMessage="No domains recorded yet."
      />

      <EntityManager<SslCertificateWithRelations>
        title="SSL certificates"
        description="Certificate coverage and expiry per website."
        newLabel="New certificate"
        items={sslCertificates}
        getId={(c) => c.id}
        getLabel={(c) => `${c.provider} — ${c.edoscentreadmin_websites?.name ?? "—"}`}
        drawerTitle={(editing) => (editing ? `Edit certificate — ${editing.provider}` : "New certificate")}
        columns={[
          { header: "Website", render: (c) => c.edoscentreadmin_websites?.name ?? "—" },
          { header: "Domain", render: (c) => c.edoscentreadmin_domains?.domain_name ?? "All" },
          { header: "Provider", render: (c) => c.provider },
          { header: "Type", render: (c) => <span className="capitalize">{c.cert_type}</span> },
          { header: "Expiry", render: (c) => (c.status === "active" ? <ExpiryBadge date={c.expiry_date} /> : <StatusBadge status={c.status} />) },
        ]}
        renderFields={(editing) => (
          <>
            <div>
              <Label htmlFor="website_id">Website</Label>
              <WebsiteSelect websites={websites} defaultValue={editing?.website_id} />
            </div>
            <div>
              <Label htmlFor="domain_id">Domain (optional)</Label>
              <Select id="domain_id" name="domain_id" defaultValue={editing?.domain_id ?? ""}>
                <option value="">All domains on this website</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.domain_name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="provider">Provider</Label>
                <Input id="provider" name="provider" required placeholder="e.g. Let's Encrypt, Sectigo" defaultValue={editing?.provider ?? ""} />
              </div>
              <div>
                <Label htmlFor="cert_type">Type</Label>
                <Select id="cert_type" name="cert_type" defaultValue={editing?.cert_type ?? "free"}>
                  {CERT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.toUpperCase()}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="issued_date">Issued date</Label>
                <Input id="issued_date" name="issued_date" type="date" defaultValue={editing?.issued_date ?? ""} />
              </div>
              <div>
                <Label htmlFor="expiry_date">Expiry date</Label>
                <Input id="expiry_date" name="expiry_date" type="date" required defaultValue={editing?.expiry_date ?? ""} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select id="status" name="status" defaultValue={editing?.status ?? "active"}>
                  {CERT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="cost">Cost</Label>
                <Input id="cost" name="cost" type="number" step="0.01" defaultValue={editing?.cost ?? ""} />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" name="currency" defaultValue={editing?.currency ?? "KES"} />
              </div>
            </div>
            <Checkbox id="auto_renew" name="auto_renew" label="Auto-renews" defaultChecked={editing?.auto_renew ?? true} />
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" defaultValue={editing?.notes ?? ""} />
            </div>
          </>
        )}
        onSubmit={async (formData, editing) => upsertSslCertificate(formData, editing?.id)}
        onDelete={async (c) => deleteSslCertificate(c.id)}
        emptyMessage="No SSL certificates recorded yet."
      />
    </div>
  );
}
