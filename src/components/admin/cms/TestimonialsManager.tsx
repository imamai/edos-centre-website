"use client";

import EntityManager from "@/components/admin/cms/EntityManager";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { Input, Textarea, Label, Select } from "@/components/admin/ui/Input";
import { Checkbox } from "@/components/admin/ui/Checkbox";
import { upsertTestimonial, deleteTestimonial } from "@/lib/admin/actions/testimonial-actions";
import type { Database } from "@/types/database.types";

type Testimonial = Database["public"]["Tables"]["edoscentre_testimonials"]["Row"];
type Industry = Database["public"]["Tables"]["edoscentre_industries"]["Row"];
type CaseStudy = Database["public"]["Tables"]["edoscentre_case_studies"]["Row"];

export default function TestimonialsManager({
  testimonials,
  industries,
  caseStudies,
}: {
  testimonials: Testimonial[];
  industries: Industry[];
  caseStudies: CaseStudy[];
}) {
  return (
    <EntityManager<Testimonial>
      title="Testimonials"
      description="Client quotes shown across the site."
      newLabel="New testimonial"
      items={testimonials}
      getId={(t) => t.id}
      getLabel={(t) => t.client_name}
      drawerTitle={(editing) => (editing ? "Edit testimonial" : "New testimonial")}
      columns={[
        { header: "Client", render: (t) => <span className="font-medium text-slate-900">{t.client_name}</span> },
        { header: "Organisation", render: (t) => t.client_org ?? "—" },
        { header: "Featured", render: (t) => (t.is_featured ? <StatusBadge status="active" /> : "—") },
        { header: "Status", render: (t) => <StatusBadge status={t.is_active ? "active" : "archived"} /> },
      ]}
      renderFields={(editing) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="client_name">Client name</Label>
              <Input id="client_name" name="client_name" required defaultValue={editing?.client_name} />
            </div>
            <div>
              <Label htmlFor="client_title">Client title</Label>
              <Input id="client_title" name="client_title" defaultValue={editing?.client_title ?? ""} />
            </div>
          </div>
          <div>
            <Label htmlFor="client_org">Organisation</Label>
            <Input id="client_org" name="client_org" defaultValue={editing?.client_org ?? ""} />
          </div>
          <div>
            <Label htmlFor="quote">Quote</Label>
            <Textarea id="quote" name="quote" required defaultValue={editing?.quote} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="client_photo">Photo URL</Label>
              <Input id="client_photo" name="client_photo" defaultValue={editing?.client_photo ?? ""} />
            </div>
            <div>
              <Label htmlFor="client_logo">Logo URL</Label>
              <Input id="client_logo" name="client_logo" defaultValue={editing?.client_logo ?? ""} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <Label htmlFor="case_study_id">Case study</Label>
              <Select id="case_study_id" name="case_study_id" defaultValue={editing?.case_study_id ?? ""}>
                <option value="">—</option>
                {caseStudies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input id="rating" name="rating" type="number" min={1} max={5} defaultValue={editing?.rating ?? ""} />
            </div>
            <div>
              <Label htmlFor="sort_order">Sort order</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
            </div>
          </div>
          <div className="flex gap-6 pt-1">
            <Checkbox id="is_featured" name="is_featured" label="Featured" defaultChecked={editing?.is_featured} />
            <Checkbox id="is_active" name="is_active" label="Active" defaultChecked={editing?.is_active ?? true} />
          </div>
        </>
      )}
      onSubmit={async (formData, editing) => upsertTestimonial(formData, editing?.id)}
      onDelete={async (t) => deleteTestimonial(t.id, t.client_name)}
    />
  );
}
