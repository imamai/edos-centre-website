import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCaseStudies } from "@/lib/queries";
import { getCaseStudyAccent } from "@/lib/icon-map";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Real-world project outcomes from Edos Centre — health systems, NGO M&E platforms, county dashboards, agricultural data systems and enterprise SaaS.",
};

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <>
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative text-center">
          <div className="section-eyebrow justify-center text-brand-red mb-4">
            <span className="w-4 h-px bg-brand-red" /> Case Studies <span className="w-4 h-px bg-brand-red" />
          </div>
          <h1 className="font-display text-display-lg font-bold text-white mb-6 text-balance">
            Real projects.<br />Measurable impact.
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Every engagement is measured against real-world outcomes — not just delivery milestones.
          </p>
        </div>
      </section>

      <section className="py-20 bg-brand-muted">
        <div className="section-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((cs) => {
              const color = getCaseStudyAccent(cs.slug);
              return (
                <Link key={cs.slug} href={`/case-studies/${cs.slug}`} className="group card-enterprise p-6 block">
                  <div className="h-1.5 rounded-full mb-5" style={{ background: color }} />
                  <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color }}>
                    {cs.industry?.name ?? "Case Study"}
                  </div>
                  <h2 className="font-display font-bold text-xl text-brand-navy mb-2 group-hover:text-brand-red transition-colors">
                    {cs.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-1">{cs.client_name}</p>
                  <p className="text-sm font-medium text-gray-700 mb-5">{cs.result_summary}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red group-hover:gap-2.5 transition-all">
                    Read case study <ArrowRight className="w-4 h-4" />
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
