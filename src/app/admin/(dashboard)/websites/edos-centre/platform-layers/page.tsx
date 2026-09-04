import { getPlatformLayersAdminFull } from "@/lib/admin/queries";
import PlatformLayersManager from "@/components/admin/cms/PlatformLayersManager";

export const metadata = { title: "Platform Framework — EDOS Control Centre" };

export default async function PlatformLayersPage() {
  const layers = await getPlatformLayersAdminFull();
  return <PlatformLayersManager layers={layers} />;
}
