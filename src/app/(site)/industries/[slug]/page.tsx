import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { getIndustries, getIndustryBySlug } from "@/lib/queries";
import { getIcon, getIndustryAccent } from "@/lib/icon-map";
import { absoluteUrl } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const industries = await getIndustries();
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) return { title: "Industry Not Found" };
  return {
    title: industry.seo_title || `${industry.name} Solutions — Edos Centre`,
    description: industry.seo_description || industry.description || undefined,
    alternates: { canonical: absoluteUrl(`/industries/${industry.slug}`) },
  };
}

export default async function IndustryDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) notFound();

  const Icon = getIcon(industry.icon);
  const color = getIndustryAccent(industry.slug);

  const challenges = [...industry.edoscentre_industry_challenges].sort((a, b) => a.sort_order - b.sort_order);
  const solutions = [...industry.edoscentre_industry_solutions].sort((a, b) => a.sort_order - b.sort_order);
  const outcomes = [...industry.edoscentre_industry_outcomes].sort((a, b) => a.sort_order - b.sort_order);
  const metrics = [...industry.edoscentre_industry_metrics].sort((a, b) => a.sort_order - b.sort_order);
  const technologies = industry.edoscentre_industry_technologies
    .map((t) => t.edoscentre_technologies)
    .filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative">
          <Breadcrumbs items={[{ name: "Industries", path: "/industries" }, { name: industry.name, path: `/industries/${industry.slug}` }]} />
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Industries
          </Link>

          <div className="flex items-start gap-6 max-w-3xl">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 mt-1"
              style={{ background: `${color}20` }}
            >
              <Icon className="w-10 h-10" style={{ color }} />
            </div>
            <div>
              <div
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color }}
              >
                Industry Solutions
              </div>
              <h1 className="font-display text-display-md font-bold text-white mb-3">
                {industry.name}
              </h1>
              {industry.tagline && <p className="text-lg text-white/60 font-medium">{industry.tagline}</p>}
            </div>
          </div>

          {industry.description && (
            <p className="mt-8 text-base text-white/70 leading-relaxed max-w-2xl">
              {industry.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/consultation" className="btn-primary !px-8 !py-3.5">
              Discuss your project <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/case-studies" className="btn-secondary !px-8 !py-3.5">
              View case studies
            </Link>
          </div>
        </div>
      </section>

      {/* Key metrics */}
      {metrics.length > 0 && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="section-container">
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {metrics.map((m) => (
                <div key={m.id} className="text-center">
                  <div
                    className="font-display text-3xl font-bold mb-1"
                    style={{ color }}
                  >
                    {m.metric_value}
                  </div>
                  <div className="text-sm text-gray-500">{m.metric_label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Challenges / Solutions / Outcomes */}
      <section className="py-20 bg-brand-muted">
        <div className="section-container">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Challenges */}
            <div className="card-enterprise p-8">
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-6"
                style={{ color: "#E31E24" }}
              >
                Challenges We Solve
              </h2>
              <ul className="space-y-4">
                {challenges.map((c) => (
                  <li key={c.id} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-brand-red mt-1.5 shrink-0" />
                    {c.challenge}
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div className="card-enterprise p-8">
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-6"
                style={{ color }}
              >
                Our Solutions
              </h2>
              <ul className="space-y-4">
                {solutions.map((s) => (
                  <li key={s.id} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color }}
                    />
                    {s.solution}
                  </li>
                ))}
              </ul>
            </div>

            {/* Outcomes */}
            <div className="card-enterprise p-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-green-600 mb-6">
                Outcomes
              </h2>
              <ul className="space-y-4">
                {outcomes.map((o) => (
                  <li key={o.id} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    {o.outcome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      {technologies.length > 0 && (
        <section className="py-16 bg-white">
          <div className="section-container max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-bold text-brand-navy mb-8">
              Tools & Technologies
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((t) => (
                <span
                  key={t.id}
                  className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 bg-brand-muted"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-brand">
        <div className="section-container text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Let&apos;s build your {industry.name} data solution
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            We&apos;ll run a free discovery session to understand your data environment
            and propose a roadmap that fits your budget and timeline.
          </p>
          <Link href="/consultation" className="btn-primary !px-10 !py-4 text-base">
            Book a free discovery call <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
