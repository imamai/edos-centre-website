import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const adminUser = await getAdminUser();
  if (!adminUser || !adminUser.is_active) redirect("/admin/login");
  if (adminUser.must_change_password) redirect("/admin/change-password");

  return <AdminShell adminUser={adminUser}>{children}</AdminShell>;
}
