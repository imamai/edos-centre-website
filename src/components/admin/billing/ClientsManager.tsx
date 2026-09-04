"use client";

import EntityManager from "@/components/admin/cms/EntityManager";
import { Input, Textarea, Label } from "@/components/admin/ui/Input";
import { upsertClient, deleteClient } from "@/lib/admin/actions/client-actions";
import type { Database } from "@/types/database.types";

type Client = Database["public"]["Tables"]["edoscentreadmin_clients"]["Row"];

export default function ClientsManager({ clients }: { clients: Client[] }) {
  return (
    <EntityManager<Client>
      title="Clients"
      description="Companies and contacts you manage websites and systems for."
      newLabel="New client"
      items={clients}
      getId={(c) => c.id}
      getLabel={(c) => c.company_name}
      drawerTitle={(editing) => (editing ? "Edit client" : "New client")}
      columns={[
        { header: "Company", render: (c) => <span className="font-medium text-slate-900">{c.company_name}</span> },
        { header: "Contact", render: (c) => c.contact_person ?? "—" },
        { header: "Email", render: (c) => c.email ?? "—" },
        { header: "Phone", render: (c) => c.phone ?? "—" },
      ]}
      renderFields={(editing) => (
        <>
          <div>
            <Label htmlFor="company_name">Company name</Label>
            <Input id="company_name" name="company_name" required defaultValue={editing?.company_name} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="contact_person">Contact person</Label>
              <Input id="contact_person" name="contact_person" defaultValue={editing?.contact_person ?? ""} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={editing?.email ?? ""} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={editing?.phone ?? ""} />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" defaultValue={editing?.address ?? ""} />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" defaultValue={editing?.notes ?? ""} />
          </div>
        </>
      )}
      onSubmit={async (formData, editing) => upsertClient(formData, editing?.id)}
      onDelete={async (c) => deleteClient(c.id, c.company_name)}
    />
  );
}
