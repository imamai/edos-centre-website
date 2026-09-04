import { getServicesAdmin, getTechnologiesAdmin } from "@/lib/admin/queries";
import ServicesManager from "@/components/admin/cms/ServicesManager";

export const metadata = { title: "Services — EDOS Control Centre" };

export default async function ServicesPage() {
  const [services, technologies] = await Promise.all([getServicesAdmin(), getTechnologiesAdmin()]);
  return <ServicesManager services={services} technologies={technologies} />;
}
