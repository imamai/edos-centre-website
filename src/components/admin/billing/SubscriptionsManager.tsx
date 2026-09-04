"use client";

import EntityManager from "@/components/admin/cms/EntityManager";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { Input, Textarea, Label, Select } from "@/components/admin/ui/Input";
import { Checkbox } from "@/components/admin/ui/Checkbox";
import { upsertSubscription, deleteSubscription } from "@/lib/admin/actions/subscription-actions";
import { upsertPlan, deletePlan } from "@/lib/admin/actions/plan-actions";
import type { Database } from "@/types/database.types";
import type { SubscriptionWithRelations } from "@/lib/admin/queries";

type Plan = Database["public"]["Tables"]["edoscentreadmin_subscription_plans"]["Row"];
type Client = Database["public"]["Tables"]["edoscentreadmin_clients"]["Row"];
type Website = Database["public"]["Tables"]["edoscentreadmin_websites"]["Row"];

const CYCLES = ["monthly", "quarterly", "semiannual", "annual", "custom"];
const STATUSES = ["trial", "active", "due_soon", "grace_period", "overdue", "suspended", "cancelled", "expired"];

export default function SubscriptionsManager({
  subscriptions,
  plans,
  clients,
  websites,
}: {
  subscriptions: SubscriptionWithRelations[];
  plans: Plan[];
  clients: Client[];
  websites: Website[];
}) {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Subscriptions</h1>
        <p className="mt-1 text-sm text-slate-500">What each website is subscribed to, and its billing status.</p>
      </div>

      <EntityManager<SubscriptionWithRelations>
        title="Active subscriptions"
        description="One row per website's subscription."
        newLabel="New subscription"
        items={subscriptions}
        getId={(s) => s.id}
        getLabel={(s) => s.edoscentreadmin_websites?.name ?? s.id}
        drawerTitle={(editing) => (editing ? "Edit subscription" : "New subscription")}
        columns={[
          { header: "Website", render: (s) => <span className="font-medium text-slate-900">{s.edoscentreadmin_websites?.name ?? "—"}</span> },
          { header: "Client", render: (s) => s.edoscentreadmin_clients?.company_name ?? "—" },
          { header: "Plan", render: (s) => s.edoscentreadmin_subscription_plans?.name ?? "—" },
          { header: "Amount", render: (s) => `${s.currency} ${Number(s.amount).toLocaleString()} / ${s.billing_cycle}` },
          { header: "Renews", render: (s) => (s.renewal_date ? new Date(s.renewal_date).toLocaleDateString() : "—") },
          { header: "Status", render: (s) => <StatusBadge status={s.status} /> },
        ]}
        renderFields={(editing) => (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="website_id">Website</Label>
                <Select id="website_id" name="website_id" required defaultValue={editing?.website_id ?? ""}>
                  <option value="" disabled>
                    Select website
                  </option>
                  {websites.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="client_id">Client</Label>
                <Select id="client_id" name="client_id" required defaultValue={editing?.client_id ?? ""}>
                  <option value="" disabled>
                    Select client
                  </option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company_name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="plan_id">Plan</Label>
              <Select id="plan_id" name="plan_id" defaultValue={editing?.plan_id ?? ""}>
                <option value="">—</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="billing_cycle">Billing cycle</Label>
                <Select id="billing_cycle" name="billing_cycle" defaultValue={editing?.billing_cycle ?? "monthly"}>
                  {CYCLES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" name="amount" type="number" step="0.01" required defaultValue={editing?.amount ?? ""} />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" name="currency" defaultValue={editing?.currency ?? "KES"} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select id="status" name="status" defaultValue={editing?.status ?? "trial"}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="start_date">Start date</Label>
                <Input id="start_date" name="start_date" type="date" required defaultValue={editing?.start_date ?? new Date().toISOString().slice(0, 10)} />
              </div>
              <div>
                <Label htmlFor="renewal_date">Renewal date</Label>
                <Input id="renewal_date" name="renewal_date" type="date" defaultValue={editing?.renewal_date ?? ""} />
              </div>
            </div>
            <div>
              <Label htmlFor="grace_period_days">Grace period (days)</Label>
              <Input id="grace_period_days" name="grace_period_days" type="number" defaultValue={editing?.grace_period_days ?? 7} />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" defaultValue={editing?.notes ?? ""} />
            </div>
            <Checkbox id="auto_renew" name="auto_renew" label="Auto-renew" defaultChecked={editing?.auto_renew ?? true} />
          </>
        )}
        onSubmit={async (formData, editing) => upsertSubscription(formData, editing?.id)}
        onDelete={async (s) => deleteSubscription(s.id)}
      />

      <EntityManager<Plan>
        title="Subscription plans"
        description="Editable pricing tiers offered to clients."
        newLabel="New plan"
        items={plans}
        getId={(p) => p.id}
        getLabel={(p) => p.name}
        drawerTitle={(editing) => (editing ? "Edit plan" : "New plan")}
        columns={[
          { header: "Name", render: (p) => <span className="font-medium text-slate-900">{p.name}</span> },
          { header: "Monthly", render: (p) => (p.monthly_price != null ? `${p.currency} ${Number(p.monthly_price).toLocaleString()}` : "—") },
          { header: "Annual", render: (p) => (p.annual_price != null ? `${p.currency} ${Number(p.annual_price).toLocaleString()}` : "—") },
          { header: "Status", render: (p) => <StatusBadge status={p.is_active ? "active" : "archived"} /> },
        ]}
        renderFields={(editing) => (
          <>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={editing?.name} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={editing?.description ?? ""} />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <Label htmlFor="monthly_price">Monthly</Label>
                <Input id="monthly_price" name="monthly_price" type="number" step="0.01" defaultValue={editing?.monthly_price ?? ""} />
              </div>
              <div>
                <Label htmlFor="quarterly_price">Quarterly</Label>
                <Input id="quarterly_price" name="quarterly_price" type="number" step="0.01" defaultValue={editing?.quarterly_price ?? ""} />
              </div>
              <div>
                <Label htmlFor="semiannual_price">Semiannual</Label>
                <Input id="semiannual_price" name="semiannual_price" type="number" step="0.01" defaultValue={editing?.semiannual_price ?? ""} />
              </div>
              <div>
                <Label htmlFor="annual_price">Annual</Label>
                <Input id="annual_price" name="annual_price" type="number" step="0.01" defaultValue={editing?.annual_price ?? ""} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="setup_fee">Setup fee</Label>
                <Input id="setup_fee" name="setup_fee" type="number" step="0.01" defaultValue={editing?.setup_fee ?? 0} />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" name="currency" defaultValue={editing?.currency ?? "KES"} />
              </div>
            </div>
            <div>
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea id="features" name="features" defaultValue={editing?.features ?? ""} />
            </div>
            <div>
              <Label htmlFor="sort_order">Sort order</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
            </div>
            <Checkbox id="is_active" name="is_active" label="Active" defaultChecked={editing?.is_active ?? true} />
          </>
        )}
        onSubmit={async (formData, editing) => upsertPlan(formData, editing?.id)}
        onDelete={async (p) => deletePlan(p.id, p.name)}
      />
    </div>
  );
}
