import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getIndustries } from "@/lib/queries";
import { getIcon, getIndustryAccent } from "@/lib/icon-map";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Industry Solutions | Healthcare, NGO, Government & Agriculture Data",
  description: "Edos Centre delivers deep-domain digital transformation solutions for healthcare, NGOs, government, education, agriculture, finance and retail in Kenya.",
  alternates: { canonical: absoluteUrl("/industries") },
};

export default async function IndustriesPage() {
  const industries = await getIndustries();

  return (
    <>
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative text-center">
          <div className="section-eyebrow justify-center text-brand-red mb-4">
            <span className="w-4 h-px bg-brand-red" /> Industries <span className="w-4 h-px bg-brand-red" />
          </div>
          <h1 className="font-display text-display-lg font-bold text-white mb-6 text-balance">
            Deep expertise.<br />Every sector.
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            We understand that healthcare data is not the same as agricultural data.
            Our solutions are built for the specific context, regulations, and goals of each industry.
          </p>
        </div>
      </section>

      <section className="py-20 bg-brand-muted">
        <div className="section-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {industries.map((ind) => {
              const Icon = getIcon(ind.icon);
              const color = getIndustryAccent(ind.slug);
              return (
                <Link key={ind.slug} href={`/industries/${ind.slug}`} className="group card-enterprise p-6 block">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `${color}15` }}>
                    <Icon className="w-7 h-7" style={{ color }} />
                  </div>
                  <h2 className="font-display font-bold text-xl text-brand-navy mb-1 group-hover:text-brand-red transition-colors">{ind.name}</h2>
                  <p className="text-sm text-gray-500 mb-4">{ind.tagline}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red group-hover:gap-2.5 transition-all">
                    Explore solutions <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
