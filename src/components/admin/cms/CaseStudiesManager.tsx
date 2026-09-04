"use client";

import EntityManager from "@/components/admin/cms/EntityManager";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { Input, Textarea, Label, Select } from "@/components/admin/ui/Input";
import { Checkbox } from "@/components/admin/ui/Checkbox";
import { upsertCaseStudy, deleteCaseStudy } from "@/lib/admin/actions/case-study-actions";
import type { Database } from "@/types/database.types";

type CaseStudy = Database["public"]["Tables"]["edoscentre_case_studies"]["Row"] & {
  edoscentre_case_study_kpis: Database["public"]["Tables"]["edoscentre_case_study_kpis"]["Row"][];
  edoscentre_case_study_technologies: { technology_id: string }[];
};
type Technology = Database["public"]["Tables"]["edoscentre_technologies"]["Row"];
type Industry = Database["public"]["Tables"]["edoscentre_industries"]["Row"];

export default function CaseStudiesManager({
  caseStudies,
  technologies,
  industries,
}: {
  caseStudies: CaseStudy[];
  technologies: Technology[];
  industries: Industry[];
}) {
  return (
    <EntityManager<CaseStudy>
      title="Case Studies"
      description="Client success stories."
      newLabel="New case study"
      items={caseStudies}
      getId={(c) => c.id}
      getLabel={(c) => c.title}
      drawerTitle={(editing) => (editing ? "Edit case study" : "New case study")}
      columns={[
        { header: "Title", render: (c) => <span className="font-medium text-slate-900">{c.title}</span> },
        { header: "Client", render: (c) => c.client_name ?? "—" },
        { header: "Featured", render: (c) => (c.is_featured ? <StatusBadge status="active" /> : "—") },
        { header: "Status", render: (c) => <StatusBadge status={c.is_published ? "published" : "draft"} /> },
      ]}
      renderFields={(editing) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required defaultValue={editing?.title} />
            </div>
            <div>
              <Label htmlFor="client_name">Client name</Label>
              <Input id="client_name" name="client_name" defaultValue={editing?.client_name ?? ""} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" name="tagline" defaultValue={editing?.tagline ?? ""} />
            </div>
            <div>
              <Label htmlFor="industry_id">Industry</Label>
              <Select id="industry_id" name="industry_id" defaultValue={editing?.industry_id ?? ""}>
                <option value="">—</option>
                {industries.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="challenge">Challenge</Label>
            <Textarea id="challenge" name="challenge" defaultValue={editing?.challenge ?? ""} />
          </div>
          <div>
            <Label htmlFor="solution">Solution</Label>
            <Textarea id="solution" name="solution" defaultValue={editing?.solution ?? ""} />
          </div>
          <div>
            <Label htmlFor="impact">Impact</Label>
            <Textarea id="impact" name="impact" defaultValue={editing?.impact ?? ""} />
          </div>
          <div>
            <Label htmlFor="result_summary">Result summary</Label>
            <Input id="result_summary" name="result_summary" defaultValue={editing?.result_summary ?? ""} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cover_image_url">Cover image URL</Label>
              <Input id="cover_image_url" name="cover_image_url" defaultValue={editing?.cover_image_url ?? ""} />
            </div>
            <div>
              <Label htmlFor="client_logo_url">Client logo URL</Label>
              <Input id="client_logo_url" name="client_logo_url" defaultValue={editing?.client_logo_url ?? ""} />
            </div>
          </div>
          <div>
            <Label htmlFor="kpis">KPIs — one per line, as "Label | Value | Unit" (unit optional)</Label>
            <Textarea
              id="kpis"
              name="kpis"
              placeholder={"Data processed | 2 | TB\nTime saved | 40 | %"}
              defaultValue={editing?.edoscentre_case_study_kpis?.map((k) => [k.metric_label, k.metric_value, k.metric_unit].filter(Boolean).join(" | ")).join("\n") ?? ""}
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
                    defaultChecked={editing?.edoscentre_case_study_technologies?.some((t) => t.technology_id === tech.id)}
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
          <div className="flex gap-6 pt-1">
            <Checkbox id="is_featured" name="is_featured" label="Featured" defaultChecked={editing?.is_featured} />
            <Checkbox id="is_published" name="is_published" label="Published" defaultChecked={editing?.is_published} />
          </div>
        </>
      )}
      onSubmit={async (formData, editing) => upsertCaseStudy(formData, editing?.id)}
      onDelete={async (c) => deleteCaseStudy(c.id, c.title)}
    />
  );
}
