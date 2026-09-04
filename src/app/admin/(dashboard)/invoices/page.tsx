import { getInvoices, getPayments, getClients, getWebsites, getSubscriptions } from "@/lib/admin/queries";
import InvoicesManager from "@/components/admin/billing/InvoicesManager";

export const metadata = { title: "Invoices — EDOS Control Centre" };

export default async function InvoicesPage() {
  const [invoices, payments, clients, websites, subscriptions] = await Promise.all([
    getInvoices(),
    getPayments(),
    getClients(),
    getWebsites(),
    getSubscriptions(),
  ]);
  return <InvoicesManager invoices={invoices} payments={payments} clients={clients} websites={websites} subscriptions={subscriptions} />;
}
