import { getHostingDetails, getDomains, getSslCertificates, getWebsites } from "@/lib/admin/queries";
import HostingManager from "@/components/admin/billing/HostingManager";

export const metadata = { title: "Hosting & Domains — EDOS Control Centre" };

export default async function HostingPage() {
  const [hostingDetails, domains, sslCertificates, websites] = await Promise.all([
    getHostingDetails(),
    getDomains(),
    getSslCertificates(),
    getWebsites(),
  ]);
  return <HostingManager hostingDetails={hostingDetails} domains={domains} sslCertificates={sslCertificates} websites={websites} />;
}
