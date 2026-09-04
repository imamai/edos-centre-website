import { getSubscriptions, getSubscriptionPlans, getClients, getWebsites } from "@/lib/admin/queries";
import SubscriptionsManager from "@/components/admin/billing/SubscriptionsManager";

export const metadata = { title: "Subscriptions — EDOS Control Centre" };

export default async function SubscriptionsPage() {
  const [subscriptions, plans, clients, websites] = await Promise.all([
    getSubscriptions(),
    getSubscriptionPlans(),
    getClients(),
    getWebsites(),
  ]);
  return <SubscriptionsManager subscriptions={subscriptions} plans={plans} clients={clients} websites={websites} />;
}
