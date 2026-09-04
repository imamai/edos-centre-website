"use client";

import EntityManager from "@/components/admin/cms/EntityManager";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { Input, Textarea, Label } from "@/components/admin/ui/Input";
import { Checkbox } from "@/components/admin/ui/Checkbox";
import { upsertTeamMember, deleteTeamMember } from "@/lib/admin/actions/team-actions";
import type { Database } from "@/types/database.types";

type TeamMember = Database["public"]["Tables"]["edoscentre_team_members"]["Row"];

export default function TeamManager({ members }: { members: TeamMember[] }) {
  return (
    <EntityManager<TeamMember>
      title="Team"
      description="Leadership and staff shown on the About page."
      newLabel="New team member"
      items={members}
      getId={(m) => m.id}
      getLabel={(m) => m.full_name}
      drawerTitle={(editing) => (editing ? "Edit team member" : "New team member")}
      columns={[
        { header: "Name", render: (m) => <span className="font-medium text-slate-900">{m.full_name}</span> },
        { header: "Role", render: (m) => m.job_title },
        { header: "Leadership", render: (m) => (m.is_leadership ? <StatusBadge status="active" /> : "—") },
        { header: "Status", render: (m) => <StatusBadge status={m.is_active ? "active" : "archived"} /> },
      ]}
      renderFields={(editing) => (
        <>
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" name="full_name" required defaultValue={editing?.full_name} />
          </div>
          <div>
            <Label htmlFor="job_title">Job title</Label>
            <Input id="job_title" name="job_title" required defaultValue={editing?.job_title} />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input id="department" name="department" defaultValue={editing?.department ?? ""} />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" defaultValue={editing?.bio ?? ""} />
          </div>
          <div>
            <Label htmlFor="photo_url">Photo URL</Label>
            <Input id="photo_url" name="photo_url" defaultValue={editing?.photo_url ?? ""} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input id="linkedin_url" name="linkedin_url" defaultValue={editing?.linkedin_url ?? ""} />
            </div>
            <div>
              <Label htmlFor="twitter_url">Twitter/X</Label>
              <Input id="twitter_url" name="twitter_url" defaultValue={editing?.twitter_url ?? ""} />
            </div>
            <div>
              <Label htmlFor="github_url">GitHub</Label>
              <Input id="github_url" name="github_url" defaultValue={editing?.github_url ?? ""} />
            </div>
          </div>
          <div>
            <Label htmlFor="sort_order">Sort order</Label>
            <Input id="sort_order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
          </div>
          <div className="flex gap-6 pt-1">
            <Checkbox id="is_leadership" name="is_leadership" label="Leadership" defaultChecked={editing?.is_leadership} />
            <Checkbox id="is_active" name="is_active" label="Active" defaultChecked={editing?.is_active ?? true} />
          </div>
        </>
      )}
      onSubmit={async (formData, editing) => upsertTeamMember(formData, editing?.id)}
      onDelete={async (m) => deleteTeamMember(m.id, m.full_name)}
    />
  );
}
