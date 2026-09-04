import { getTestimonialsAdmin, getIndustriesAdmin } from "@/lib/admin/queries";
import TestimonialsManager from "@/components/admin/cms/TestimonialsManager";

export const metadata = { title: "Testimonials — EDOS Control Centre" };

export default async function TestimonialsPage() {
  const [testimonials, industries] = await Promise.all([getTestimonialsAdmin(), getIndustriesAdmin()]);
  return <TestimonialsManager testimonials={testimonials} industries={industries} />;
}
