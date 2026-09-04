import { getTestimonialsAdmin, getIndustriesAdmin, getCaseStudiesAdmin } from "@/lib/admin/queries";
import TestimonialsManager from "@/components/admin/cms/TestimonialsManager";

export const metadata = { title: "Testimonials — EDOS Control Centre" };

export default async function TestimonialsPage() {
  const [testimonials, industries, caseStudies] = await Promise.all([
    getTestimonialsAdmin(),
    getIndustriesAdmin(),
    getCaseStudiesAdmin(),
  ]);
  return <TestimonialsManager testimonials={testimonials} industries={industries} caseStudies={caseStudies} />;
}
