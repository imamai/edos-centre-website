"use client";

import EntityManager from "@/components/admin/cms/EntityManager";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { Input, Label, Select } from "@/components/admin/ui/Input";
import { Checkbox } from "@/components/admin/ui/Checkbox";
import { upsertNavigationItem, deleteNavigationItem } from "@/lib/admin/actions/navigation-actions";
import type { Database } from "@/types/database.types";

type NavItem = Database["public"]["Tables"]["edoscentre_navigation_items"]["Row"];

const MENU_SLOTS = [
  "primary",
  "footer_company",
  "footer_resources",
  "footer_services",
  "footer_industries",
  "footer_legal",
];

export default function NavigationManager({ items }: { items: NavItem[] }) {
  const topLevelPrimary = items.filter((i) => i.menu_slot === "primary" && !i.parent_id);

  return (
    <EntityManager<NavItem>
      title="Navigation"
      description="Header and footer menu items. Changes reflect on the public site without a deploy."
      newLabel="New menu item"
      items={items}
      getId={(n) => n.id}
      getLabel={(n) => n.label}
      drawerTitle={(editing) => (editing ? "Edit menu item" : "New menu item")}
      columns={[
        { header: "Label", render: (n) => <span className="font-medium text-slate-900">{n.label}</span> },
        { header: "Href", render: (n) => <span className="font-mono text-xs text-slate-500">{n.href}</span> },
        { header: "Menu", render: (n) => n.menu_slot },
        { header: "Order", render: (n) => n.sort_order },
        { header: "Status", render: (n) => <StatusBadge status={n.is_active ? "active" : "archived"} /> },
      ]}
      renderFields={(editing) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="label">Label</Label>
              <Input id="label" name="label" required defaultValue={editing?.label} />
            </div>
            <div>
              <Label htmlFor="href">Link (href)</Label>
              <Input id="href" name="href" required defaultValue={editing?.href} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="menu_slot">Menu</Label>
              <Select id="menu_slot" name="menu_slot" defaultValue={editing?.menu_slot ?? "primary"}>
                {MENU_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="sort_order">Sort order</Label>
              <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="parent_id">Parent (for dropdown submenus)</Label>
              <Select id="parent_id" name="parent_id" defaultValue={editing?.parent_id ?? ""}>
                <option value="">None (top-level item)</option>
                {topLevelPrimary
                  .filter((p) => p.id !== editing?.id)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description (dropdown submenu items only)</Label>
              <Input id="description" name="description" defaultValue={editing?.description ?? ""} />
            </div>
          </div>
          <div className="flex gap-6 pt-1">
            <Checkbox id="is_active" name="is_active" label="Active" defaultChecked={editing?.is_active ?? true} />
            <Checkbox id="open_in_new" name="open_in_new" label="Open in new tab" defaultChecked={editing?.open_in_new} />
          </div>
        </>
      )}
      onSubmit={async (formData, editing) => upsertNavigationItem(formData, editing?.id)}
      onDelete={async (n) => deleteNavigationItem(n.id, n.label)}
    />
  );
}
