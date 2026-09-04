"use client";

import EntityManager from "@/components/admin/cms/EntityManager";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { Input, Label } from "@/components/admin/ui/Input";
import { Checkbox } from "@/components/admin/ui/Checkbox";
import { upsertMetric, deleteMetric } from "@/lib/admin/actions/metric-actions";
import type { Database } from "@/types/database.types";

type Metric = Database["public"]["Tables"]["edoscentre_metrics"]["Row"];

export default function MetricsManager({ metrics }: { metrics: Metric[] }) {
  return (
    <EntityManager<Metric>
      title="Homepage Metrics"
      description="The animated stat strip shown on the homepage (e.g. 50+ Projects Delivered)."
      newLabel="New metric"
      items={metrics}
      getId={(m) => m.id}
      getLabel={(m) => m.sub_label}
      drawerTitle={(editing) => (editing ? "Edit metric" : "New metric")}
      columns={[
        { header: "Value", render: (m) => <span className="font-medium text-slate-900">{m.value}{m.suffix}</span> },
        { header: "Label", render: (m) => m.sub_label },
        { header: "Description", render: (m) => m.description ?? "—" },
        { header: "Status", render: (m) => <StatusBadge status={m.is_active ? "active" : "archived"} /> },
      ]}
      renderFields={(editing) => (
        <>
          <div>
            <Label htmlFor="sub_label">Label</Label>
            <Input id="sub_label" name="sub_label" required defaultValue={editing?.sub_label} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="value">Value (numeric)</Label>
              <Input id="value" name="value" type="number" step="any" required defaultValue={editing?.value ?? 0} />
            </div>
            <div>
              <Label htmlFor="suffix">Suffix</Label>
              <Input id="suffix" name="suffix" placeholder="+, %, M+" defaultValue={editing?.suffix ?? ""} />
            </div>
            <div>
              <Label htmlFor="sort_order">Sort order</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" defaultValue={editing?.description ?? ""} />
          </div>
          <Checkbox id="is_active" name="is_active" label="Active" defaultChecked={editing?.is_active ?? true} />
        </>
      )}
      onSubmit={async (formData, editing) => upsertMetric(formData, editing?.id)}
      onDelete={async (m) => deleteMetric(m.id, m.sub_label)}
    />
  );
}
