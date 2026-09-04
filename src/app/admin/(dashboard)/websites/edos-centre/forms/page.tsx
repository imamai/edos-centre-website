import { getFormSubmissions } from "@/lib/admin/queries";
import FormsInbox from "@/components/admin/cms/FormsInbox";

export const metadata = { title: "Forms Inbox — EDOS Control Centre" };

export default async function FormsPage() {
  const { contact, consultation, newsletter } = await getFormSubmissions();
  return <FormsInbox contact={contact} consultation={consultation} newsletter={newsletter} />;
}
