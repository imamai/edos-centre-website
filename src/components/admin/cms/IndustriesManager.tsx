"use client";

import EntityManager from "@/components/admin/cms/EntityManager";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { Input, Textarea, Label } from "@/components/admin/ui/Input";
import { Checkbox } from "@/components/admin/ui/Checkbox";
import { upsertIndustry, deleteIndustry } from "@/lib/admin/actions/industry-actions";
import type { Database } from "@/types/database.types";

type Industry = Database["public"]["Tables"]["edoscentre_industries"]["Row"] & {
  edoscentre_industry_challenges: Database["public"]["Tables"]["edoscentre_industry_challenges"]["Row"][];
  edoscentre_industry_solutions: Database["public"]["Tables"]["edoscentre_industry_solutions"]["Row"][];
  edoscentre_industry_outcomes: Database["public"]["Tables"]["edoscentre_industry_outcomes"]["Row"][];
  edoscentre_industry_metrics: Database["public"]["Tables"]["edoscentre_industry_metrics"]["Row"][];
  edoscentre_industry_technologies: { technology_id: string }[];
};
type Technology = Database["public"]["Tables"]["edoscentre_technologies"]["Row"];

export default function IndustriesManager({ industries, technologies }: { industries: Industry[]; technologies: Technology[] }) {
  return (
    <EntityManager<Industry>
      title="Industries"
      description="Sectors served, shown on the Industries pages."
      newLabel="New industry"
      items={industries}
      getId={(i) => i.id}
      getLabel={(i) => i.name}
      drawerTitle={(editing) => (editing ? "Edit industry" : "New industry")}
      columns={[
        { header: "Name", render: (i) => <span className="font-medium text-slate-900">{i.name}</span> },
        { header: "Tagline", render: (i) => i.tagline ?? "—" },
        { header: "Status", render: (i) => <StatusBadge status={i.is_active ? "active" : "archived"} /> },
      ]}
      renderFields={(editing) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={editing?.name} />
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
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="icon">Icon</Label>
              <Input id="icon" name="icon" defaultValue={editing?.icon ?? ""} />
            </div>
            <div>
              <Label htmlFor="hero_stat">Hero stat</Label>
              <Input id="hero_stat" name="hero_stat" defaultValue={editing?.hero_stat ?? ""} />
            </div>
            <div>
              <Label htmlFor="sort_order">Sort order</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
            </div>
          </div>
          <div>
            <Label htmlFor="cover_image_url">Cover image URL</Label>
            <Input id="cover_image_url" name="cover_image_url" defaultValue={editing?.cover_image_url ?? ""} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="challenges">Challenges (one per line)</Label>
              <Textarea
                id="challenges"
                name="challenges"
                defaultValue={editing?.edoscentre_industry_challenges?.map((c) => c.challenge).join("\n") ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="solutions">Solutions (one per line)</Label>
              <Textarea
                id="solutions"
                name="solutions"
                defaultValue={editing?.edoscentre_industry_solutions?.map((s) => s.solution).join("\n") ?? ""}
              />
            </div>
            <div>
              <Label htmlFor="outcomes">Outcomes (one per line)</Label>
              <Textarea
                id="outcomes"
                name="outcomes"
                defaultValue={editing?.edoscentre_industry_outcomes?.map((o) => o.outcome).join("\n") ?? ""}
              />
            </div>
          </div>
          <div>
            <Label>Key metrics (shown at the top of the industry page)</Label>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => {
                const m = editing?.edoscentre_industry_metrics?.[i];
                return (
                  <div key={i} className="grid grid-cols-2 gap-3">
                    <Input name="metric_label" placeholder="Label, e.g. Facilities Connected" defaultValue={m?.metric_label ?? ""} />
                    <Input name="metric_value" placeholder="Value, e.g. 200+" defaultValue={m?.metric_value ?? ""} />
                  </div>
                );
              })}
            </div>
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
                    defaultChecked={editing?.edoscentre_industry_technologies?.some((t) => t.technology_id === tech.id)}
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
              <Label htmlFor="seo_description">SEO description</Label>
              <Input id="seo_description" name="seo_description" defaultValue={editing?.seo_description ?? ""} />
            </div>
          </div>
          <Checkbox id="is_active" name="is_active" label="Published" defaultChecked={editing?.is_active ?? true} />
        </>
      )}
      onSubmit={async (formData, editing) => upsertIndustry(formData, editing?.id)}
      onDelete={async (i) => deleteIndustry(i.id, i.name)}
    />
  );
}
