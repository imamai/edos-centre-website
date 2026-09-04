import { getNavigationItemsAdmin } from "@/lib/admin/queries";
import NavigationManager from "@/components/admin/cms/NavigationManager";

export const metadata = { title: "Navigation — EDOS Control Centre" };

export default async function NavigationPage() {
  const items = await getNavigationItemsAdmin();
  return <NavigationManager items={items} />;
}
