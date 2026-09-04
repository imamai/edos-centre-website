import { getIndustriesAdminFull, getTechnologiesAdmin } from "@/lib/admin/queries";
import IndustriesManager from "@/components/admin/cms/IndustriesManager";

export const metadata = { title: "Industries — EDOS Control Centre" };

export default async function IndustriesPage() {
  const [industries, technologies] = await Promise.all([getIndustriesAdminFull(), getTechnologiesAdmin()]);
  return <IndustriesManager industries={industries} technologies={technologies} />;
}
