import HeroSection         from "@/components/sections/HeroSection";
import PlatformFramework   from "@/components/sections/PlatformFramework";
import SolutionsGrid       from "@/components/sections/SolutionsGrid";
import IndustriesSection   from "@/components/sections/IndustriesSection";
import TechEcosystem       from "@/components/sections/TechEcosystem";
import SuccessStories      from "@/components/sections/SuccessStories";
import MetricsSection      from "@/components/sections/MetricsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ThoughtLeadership   from "@/components/sections/ThoughtLeadership";
import CtaSection          from "@/components/sections/CtaSection";
import { getMetrics, getPlatformLayers, getCaseStudies, getTestimonials } from "@/lib/queries";

export default async function HomePage() {
  const [metrics, platformLayers, caseStudies, testimonials] = await Promise.all([
    getMetrics(),
    getPlatformLayers(),
    getCaseStudies(),
    getTestimonials({ featured: true }),
  ]);

  return (
    <>
      <HeroSection />
      <PlatformFramework layers={platformLayers} />
      <SolutionsGrid />
      <MetricsSection metrics={metrics} />
      <IndustriesSection />
      <TechEcosystem />
      <SuccessStories caseStudies={caseStudies} />
      <TestimonialsSection testimonials={testimonials} />
      <ThoughtLeadership />
      <CtaSection />
    </>
  );
}
