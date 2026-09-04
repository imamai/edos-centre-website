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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PlatformFramework />
      <SolutionsGrid />
      <MetricsSection />
      <IndustriesSection />
      <TechEcosystem />
      <SuccessStories />
      <TestimonialsSection />
      <ThoughtLeadership />
      <CtaSection />
    </>
  );
}
