"use client";

import EntityManager from "@/components/admin/cms/EntityManager";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { Input, Textarea, Label } from "@/components/admin/ui/Input";
import { Checkbox } from "@/components/admin/ui/Checkbox";
import { upsertService, deleteService } from "@/lib/admin/actions/service-actions";
import type { Database } from "@/types/database.types";

type Capability = Database["public"]["Tables"]["edoscentre_service_capabilities"]["Row"];
type Service = Database["public"]["Tables"]["edoscentre_services"]["Row"] & {
  edoscentre_service_capabilities: Capability[];
  edoscentre_service_technologies: { technology_id: string }[];
};
type Technology = Database["public"]["Tables"]["edoscentre_technologies"]["Row"];

export default function ServicesManager({ services, technologies }: { services: Service[]; technologies: Technology[] }) {
  return (
    <EntityManager<Service>
      title="Services"
      description="Solutions offered, shown on the Services pages."
      newLabel="New service"
      items={services}
      getId={(s) => s.id}
      getLabel={(s) => s.title}
      drawerTitle={(editing) => (editing ? "Edit service" : "New service")}
      columns={[
        { header: "Title", render: (s) => <span className="font-medium text-slate-900">{s.title}</span> },
        { header: "Tagline", render: (s) => s.tagline ?? "—" },
        { header: "Featured", render: (s) => (s.is_featured ? <StatusBadge status="active" /> : "—") },
        { header: "Status", render: (s) => <StatusBadge status={s.is_active ? "active" : "archived"} /> },
      ]}
      renderFields={(editing) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required defaultValue={editing?.title} />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" name="tagline" defaultValue={editing?.tagline ?? ""} />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Short description</Label>
            <Textarea id="description" name="description" defaultValue={editing?.description ?? ""} />
          </div>
          <div>
            <Label htmlFor="long_description">Full description</Label>
            <Textarea id="long_description" name="long_description" defaultValue={editing?.long_description ?? ""} className="min-h-[140px]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="icon">Icon (lucide name)</Label>
              <Input id="icon" name="icon" defaultValue={editing?.icon ?? ""} />
            </div>
            <div>
              <Label htmlFor="cover_image_url">Cover image URL</Label>
              <Input id="cover_image_url" name="cover_image_url" defaultValue={editing?.cover_image_url ?? ""} />
            </div>
          </div>
          <div>
            <Label htmlFor="capabilities">Capabilities (one per line)</Label>
            <Textarea
              id="capabilities"
              name="capabilities"
              defaultValue={editing?.edoscentre_service_capabilities?.map((c) => c.capability).join("\n") ?? ""}
              className="min-h-[100px]"
            />
          </div>
          <div>
            <Label>Technologies</Label>
            <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
              {technologies.map((tech) => (
                <label key={tech.id} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="technology_ids"
                    value={tech.id}
                    defaultChecked={editing?.edoscentre_service_technologies?.some((t) => t.technology_id === tech.id)}
                    className="h-4 w-4 rounded border-slate-300 text-[#1A1733] focus:ring-[#1A1733]/30"
                  />
                  {tech.name}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="seo_title">SEO title</Label>
              <Input id="seo_title" name="seo_title" defaultValue={editing?.seo_title ?? ""} />
            </div>
            <div>
              <Label htmlFor="sort_order">Sort order</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
            </div>
          </div>
          <div>
            <Label htmlFor="seo_description">SEO description</Label>
            <Textarea id="seo_description" name="seo_description" defaultValue={editing?.seo_description ?? ""} />
          </div>
          <div className="flex gap-6 pt-1">
            <Checkbox id="is_featured" name="is_featured" label="Featured" defaultChecked={editing?.is_featured} />
            <Checkbox id="is_active" name="is_active" label="Published" defaultChecked={editing?.is_active ?? true} />
          </div>
        </>
      )}
      onSubmit={async (formData, editing) => upsertService(formData, editing?.id)}
      onDelete={async (s) => deleteService(s.id, s.title)}
    />
  );
}
