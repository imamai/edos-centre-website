"use client";

import EntityManager from "@/components/admin/cms/EntityManager";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { Input, Textarea, Label } from "@/components/admin/ui/Input";
import { Checkbox } from "@/components/admin/ui/Checkbox";
import { upsertPlatformLayer, deletePlatformLayer } from "@/lib/admin/actions/platform-layer-actions";
import type { Database } from "@/types/database.types";

type PlatformLayer = Database["public"]["Tables"]["edoscentre_platform_layers"]["Row"] & {
  edoscentre_platform_layer_tools: Database["public"]["Tables"]["edoscentre_platform_layer_tools"]["Row"][];
};

export default function PlatformLayersManager({ layers }: { layers: PlatformLayer[] }) {
  return (
    <EntityManager<PlatformLayer>
      title="Platform Framework"
      description="The 5-layer data framework shown on the homepage (Data Collection → Decision Support)."
      newLabel="New layer"
      items={layers}
      getId={(l) => l.id}
      getLabel={(l) => l.name}
      drawerTitle={(editing) => (editing ? "Edit layer" : "New layer")}
      columns={[
        { header: "#", render: (l) => l.layer_number },
        { header: "Name", render: (l) => <span className="font-medium text-slate-900">{l.name}</span> },
        { header: "Subtitle", render: (l) => l.subtitle ?? "—" },
        { header: "Status", render: (l) => <StatusBadge status={l.is_active ? "active" : "archived"} /> },
      ]}
      renderFields={(editing) => (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="layer_number">Layer #</Label>
              <Input id="layer_number" name="layer_number" type="number" required defaultValue={editing?.layer_number ?? 1} />
            </div>
            <div className="col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={editing?.name} />
            </div>
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" name="subtitle" defaultValue={editing?.subtitle ?? ""} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={editing?.description ?? ""} />
          </div>
          <div>
            <Label htmlFor="example">Real-world example</Label>
            <Textarea id="example" name="example" defaultValue={editing?.example ?? ""} />
          </div>
          <div>
            <Label htmlFor="tools">Technologies (one per line)</Label>
            <Textarea
              id="tools"
              name="tools"
              defaultValue={editing?.edoscentre_platform_layer_tools?.map((t) => t.custom_name).join("\n") ?? ""}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="icon">Icon</Label>
              <Input id="icon" name="icon" placeholder="Database, Cpu, BarChart3, Globe, Brain" defaultValue={editing?.icon ?? ""} />
            </div>
            <div>
              <Label htmlFor="color_hex">Color (hex)</Label>
              <Input id="color_hex" name="color_hex" required defaultValue={editing?.color_hex ?? "#E31E24"} />
            </div>
            <div>
              <Label htmlFor="sort_order">Sort order</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
            </div>
          </div>
          <Checkbox id="is_active" name="is_active" label="Active" defaultChecked={editing?.is_active ?? true} />
        </>
      )}
      onSubmit={async (formData, editing) => upsertPlatformLayer(formData, editing?.id)}
      onDelete={async (l) => deletePlatformLayer(l.id, l.name)}
    />
  );
}
