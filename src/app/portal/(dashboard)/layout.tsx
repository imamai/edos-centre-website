import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPortalUser } from "@/lib/portal/auth";
import PortalShell from "@/components/portal/PortalShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PortalDashboardLayout({ children }: { children: React.ReactNode }) {
  const portalUser = await getPortalUser();
  if (!portalUser || !portalUser.is_active) redirect("/portal/login");
  if (portalUser.must_change_password) redirect("/portal/change-password");

  return <PortalShell portalUser={portalUser}>{children}</PortalShell>;
}
