import { getWebsites } from "@/lib/admin/queries";
import WebsitesManager from "@/components/admin/WebsitesManager";

export const metadata = { title: "Websites — EDOS Control Centre" };

export default async function WebsitesPage() {
  const websites = await getWebsites();
  return <WebsitesManager websites={websites} />;
}
