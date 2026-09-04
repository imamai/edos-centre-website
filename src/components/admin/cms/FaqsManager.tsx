"use client";

import EntityManager from "@/components/admin/cms/EntityManager";
import { Input, Textarea, Label, Select } from "@/components/admin/ui/Input";
import { Checkbox } from "@/components/admin/ui/Checkbox";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { upsertFaq, deleteFaq, upsertFaqCategory, deleteFaqCategory } from "@/lib/admin/actions/faq-actions";
import type { Database } from "@/types/database.types";

type FaqCategory = Database["public"]["Tables"]["edoscentre_faq_categories"]["Row"];
type Faq = Database["public"]["Tables"]["edoscentre_faqs"]["Row"] & {
  edoscentre_faq_categories: { id: string; name: string } | null;
};

export default function FaqsManager({ faqs, categories }: { faqs: Faq[]; categories: FaqCategory[] }) {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">FAQs</h1>
        <p className="mt-1 text-sm text-slate-500">Frequently asked questions and their categories.</p>
      </div>

      <EntityManager<Faq>
        title="Questions"
        description="Manage the FAQ list shown on the site."
        newLabel="New FAQ"
        items={faqs}
        getId={(f) => f.id}
        getLabel={(f) => f.question}
        drawerTitle={(editing) => (editing ? "Edit FAQ" : "New FAQ")}
        columns={[
          { header: "Question", render: (f) => <span className="font-medium text-slate-900">{f.question}</span> },
          { header: "Category", render: (f) => f.edoscentre_faq_categories?.name ?? "—" },
          { header: "Status", render: (f) => <StatusBadge status={f.is_active ? "active" : "archived"} /> },
        ]}
        renderFields={(editing) => (
          <>
            <div>
              <Label htmlFor="question">Question</Label>
              <Input id="question" name="question" required defaultValue={editing?.question} />
            </div>
            <div>
              <Label htmlFor="answer">Answer</Label>
              <Textarea id="answer" name="answer" required defaultValue={editing?.answer} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="category_id">Category</Label>
                <Select id="category_id" name="category_id" defaultValue={editing?.category_id ?? ""}>
                  <option value="">—</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="sort_order">Sort order</Label>
                <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
              </div>
            </div>
            <Checkbox id="is_active" name="is_active" label="Active" defaultChecked={editing?.is_active ?? true} />
          </>
        )}
        onSubmit={async (formData, editing) => upsertFaq(formData, editing?.id)}
        onDelete={async (f) => deleteFaq(f.id)}
      />

      <EntityManager<FaqCategory>
        title="Categories"
        description="Group FAQs into categories."
        newLabel="New category"
        items={categories}
        getId={(c) => c.id}
        getLabel={(c) => c.name}
        drawerTitle={(editing) => (editing ? "Edit category" : "New category")}
        columns={[{ header: "Name", render: (c) => c.name }, { header: "Slug", render: (c) => c.slug }]}
        renderFields={(editing) => (
          <>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={editing?.name} />
            </div>
            <div>
              <Label htmlFor="sort_order">Sort order</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
            </div>
          </>
        )}
        onSubmit={async (formData, editing) => upsertFaqCategory(formData, editing?.id)}
        onDelete={async (c) => deleteFaqCategory(c.id)}
      />
    </div>
  );
}
