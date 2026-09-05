import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";
import { getUnreadNotificationCount } from "@/lib/admin/queries";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const adminUser = await getAdminUser();
  if (!adminUser || !adminUser.is_active) redirect("/admin/login");
  if (adminUser.must_change_password) redirect("/admin/change-password");

  const unreadCount = await getUnreadNotificationCount(adminUser.id);

  return (
    <AdminShell adminUser={adminUser} unreadCount={unreadCount}>
      {children}
    </AdminShell>
  );
}
