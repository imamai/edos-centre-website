import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import SiteStatusNotice from "@/components/ui/SiteStatusNotice";
import { getPublicWebsiteStatus } from "@/lib/website-status";
import { getNavigation, getSiteSettings } from "@/lib/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getPublicWebsiteStatus("edos-centre");

  if (site && (site.status === "suspended" || site.status === "maintenance")) {
    return <SiteStatusNotice status={site.status} message={site.status_message} returnAt={site.maintenance_return_at} />;
  }

  const [nav, settings] = await Promise.all([getNavigation(), getSiteSettings()]);

  return (
    <>
      <Navbar nav={nav} />
      <main>{children}</main>
      <Footer nav={nav} settings={settings} />
      <WhatsAppFloat phone={settings.contact_phone} />
    </>
  );
}
