import { getMetricsAdmin } from "@/lib/admin/queries";
import MetricsManager from "@/components/admin/cms/MetricsManager";

export const metadata = { title: "Homepage Metrics — EDOS Control Centre" };

export default async function MetricsPage() {
  const metrics = await getMetricsAdmin();
  return <MetricsManager metrics={metrics} />;
}
