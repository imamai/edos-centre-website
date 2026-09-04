import { getCaseStudiesAdmin, getTechnologiesAdmin, getIndustriesAdmin } from "@/lib/admin/queries";
import CaseStudiesManager from "@/components/admin/cms/CaseStudiesManager";

export const metadata = { title: "Case Studies — EDOS Control Centre" };

export default async function CaseStudiesPage() {
  const [caseStudies, technologies, industries] = await Promise.all([
    getCaseStudiesAdmin(),
    getTechnologiesAdmin(),
    getIndustriesAdmin(),
  ]);
  return <CaseStudiesManager caseStudies={caseStudies} technologies={technologies} industries={industries} />;
}
