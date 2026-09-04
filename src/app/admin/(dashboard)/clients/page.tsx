import { getClients, getClientPortalUsers } from "@/lib/admin/queries";
import ClientsManager from "@/components/admin/billing/ClientsManager";

export const metadata = { title: "Clients — EDOS Control Centre" };

export default async function ClientsPage() {
  const [clients, portalUsers] = await Promise.all([getClients(), getClientPortalUsers()]);
  return <ClientsManager clients={clients} portalUsers={portalUsers} />;
}
