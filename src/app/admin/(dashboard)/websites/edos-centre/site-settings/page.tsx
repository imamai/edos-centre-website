import { getSiteSettings } from "@/lib/admin/queries";
import SiteSettingsManager from "@/components/admin/cms/SiteSettingsManager";

export const metadata = { title: "Site Settings — EDOS Control Centre" };

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();
  return <SiteSettingsManager settings={settings} />;
}
