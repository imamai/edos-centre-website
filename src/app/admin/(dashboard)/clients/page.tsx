import { getClients } from "@/lib/admin/queries";
import ClientsManager from "@/components/admin/billing/ClientsManager";

export const metadata = { title: "Clients — EDOS Control Centre" };

export default async function ClientsPage() {
  const clients = await getClients();
  return <ClientsManager clients={clients} />;
}
