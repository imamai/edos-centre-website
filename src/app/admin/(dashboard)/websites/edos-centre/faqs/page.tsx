import { getFaqsAdmin, getFaqCategories } from "@/lib/admin/queries";
import FaqsManager from "@/components/admin/cms/FaqsManager";

export const metadata = { title: "FAQs — EDOS Control Centre" };

export default async function FaqsPage() {
  const [faqs, categories] = await Promise.all([getFaqsAdmin(), getFaqCategories()]);
  return <FaqsManager faqs={faqs} categories={categories} />;
}
