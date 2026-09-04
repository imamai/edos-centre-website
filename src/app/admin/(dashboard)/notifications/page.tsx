import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";
import { getNotifications } from "@/lib/admin/queries";
import NotificationsPanel from "@/components/admin/NotificationsPanel";

export const metadata = { title: "Notifications — EDOS Control Centre" };

export default async function NotificationsPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

  const notifications = await getNotifications(admin.id);
  return <NotificationsPanel notifications={notifications} canRunSweep={admin.role === "super_admin"} />;
}
