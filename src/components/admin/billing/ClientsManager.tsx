"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, ShieldCheck, UserX, UserCheck, Copy } from "lucide-react";
import EntityManager from "@/components/admin/cms/EntityManager";
import { Input, Textarea, Label } from "@/components/admin/ui/Input";
import { Button } from "@/components/admin/ui/Button";
import { Drawer } from "@/components/admin/ui/Drawer";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { upsertClient, deleteClient } from "@/lib/admin/actions/client-actions";
import { invitePortalUser, setPortalUserActive, resetPortalUserPassword } from "@/lib/admin/actions/client-portal-user-actions";
import type { Database } from "@/types/database.types";

type Client = Database["public"]["Tables"]["edoscentreadmin_clients"]["Row"];
type PortalUser = Database["public"]["Tables"]["edoscentreadmin_client_portal_users"]["Row"];

export default function ClientsManager({ clients, portalUsers }: { clients: Client[]; portalUsers: PortalUser[] }) {
  const router = useRouter();
  const [portalClient, setPortalClient] = useState<Client | null>(null);
  const [pending, setPending] = useState(false);
  const [credentialResult, setCredentialResult] = useState<{ email: string; tempPassword: string | null; isNewAccount: boolean } | null>(null);

  const portalUsersFor = (clientId: string) => portalUsers.filter((u) => u.client_id === clientId);

  async function onInvitePortal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const result = await invitePortalUser(new FormData(e.currentTarget));
      setCredentialResult(result);
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to invite portal user.");
    } finally {
      setPending(false);
    }
  }

  async function onToggleActive(user: PortalUser) {
    try {
      await setPortalUserActive(user.id, !user.is_active);
      toast.success(user.is_active ? "Portal access deactivated." : "Portal access reactivated.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to update portal access.");
    }
  }

  async function onResetPassword(user: PortalUser) {
    try {
      const result = await resetPortalUserPassword(user.id);
      setCredentialResult({ email: user.email, tempPassword: result.tempPassword, isNewAccount: true });
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to reset password.");
    }
  }

  function copyPassword() {
    if (!credentialResult?.tempPassword) return;
    navigator.clipboard?.writeText(credentialResult.tempPassword).then(() => toast.success("Copied."));
  }

  return (
    <div className="space-y-6">
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
          {
            header: "Portal access",
            render: (c) => (
              <button
                onClick={() => setPortalClient(c)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {portalUsersFor(c.id).length > 0 ? `${portalUsersFor(c.id).length} login(s)` : "No access"}
              </button>
            ),
          },
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

      <Drawer
        open={!!portalClient}
        onOpenChange={(open) => !open && setPortalClient(null)}
        title={`Portal access — ${portalClient?.company_name ?? ""}`}
        description="Who from this client can log in to view their own invoices and status. No email is sent — temporary passwords are shown once, here."
      >
        {portalClient && (
          <div className="space-y-6">
            <div className="space-y-3">
              {portalUsersFor(portalClient.id).length === 0 ? (
                <p className="text-sm text-slate-400">No portal logins yet.</p>
              ) : (
                portalUsersFor(portalClient.id).map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                    <div>
                      <div className="text-sm font-medium text-slate-800">{user.full_name ?? user.email}</div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={user.is_active ? "active" : "suspended"} />
                      <button onClick={() => onResetPassword(user)} title="Reset password" className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <KeyRound className="h-4 w-4" />
                      </button>
                      <button onClick={() => onToggleActive(user)} title={user.is_active ? "Deactivate" : "Activate"} className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={onInvitePortal} className="space-y-4 border-t border-slate-100 pt-5">
              <input type="hidden" name="client_id" value={portalClient.id} />
              <h3 className="text-sm font-medium text-slate-700">Invite a new login</h3>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required defaultValue={portalClient.email ?? ""} />
              </div>
              <div>
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" name="full_name" defaultValue={portalClient.contact_person ?? ""} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" loading={pending}>
                  Invite
                </Button>
              </div>
            </form>
          </div>
        )}
      </Drawer>

      <Drawer
        open={!!credentialResult}
        onOpenChange={(open) => !open && setCredentialResult(null)}
        title={credentialResult?.tempPassword ? "Temporary password" : "Access granted"}
        description={credentialResult?.tempPassword ? "Shown once — copy it now and hand it off securely. It cannot be retrieved again." : undefined}
      >
        {credentialResult && (
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input readOnly value={credentialResult.email} />
            </div>
            {credentialResult.tempPassword ? (
              <div>
                <Label>Temporary password</Label>
                <div className="flex gap-2">
                  <Input readOnly value={credentialResult.tempPassword} className="font-mono" />
                  <Button type="button" variant="secondary" onClick={copyPassword}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-xs text-slate-400">Portal URL: /portal/login. They&apos;ll be forced to set a new password on first sign-in.</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                This email already had an account — no new password was generated. They can sign in with their existing password at /portal/login.
              </p>
            )}
            <div className="flex justify-end pt-2">
              <Button type="button" onClick={() => setCredentialResult(null)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
