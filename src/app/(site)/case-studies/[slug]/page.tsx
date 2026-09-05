import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { getCaseStudies, getCaseStudyBySlug } from "@/lib/queries";
import { getIcon, getCaseStudyAccent } from "@/lib/icon-map";
import { absoluteUrl } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) return { title: "Case Study Not Found" };
  return {
    title: cs.seo_title || `${cs.title} — Edos Centre Case Study`,
    description: cs.seo_description || cs.tagline || undefined,
    alternates: { canonical: absoluteUrl(`/case-studies/${cs.slug}`) },
  };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const color = getCaseStudyAccent(cs.slug);
  const Icon = getIcon(cs.industry?.icon);

  const kpis = cs.kpis;
  const technologies = cs.technologies;
  const testimonial = cs.testimonial;

  const allCaseStudies = await getCaseStudies();
  const others = allCaseStudies.filter((c) => c.slug !== cs.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative">
          <Breadcrumbs items={[{ name: "Case Studies", path: "/case-studies" }, { name: cs.title, path: `/case-studies/${cs.slug}` }]} />
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Case Studies
          </Link>

          <div className="max-w-3xl">
            <div
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color }}
            >
              {[cs.industry?.name, cs.project_year, cs.duration].filter(Boolean).join(" · ")}
            </div>
            <h1 className="font-display text-display-md font-bold text-white mb-4 text-balance">
              {cs.title}
            </h1>
            {cs.tagline && <p className="text-lg text-white/70 font-medium mb-6">{cs.tagline}</p>}
            {cs.client_name && <p className="text-sm text-white/50">Client: {cs.client_name}</p>}
          </div>
        </div>
      </section>

      {/* KPIs */}
      {kpis.length > 0 && (
        <section className="py-12 border-b border-gray-100 bg-white">
          <div className="section-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {kpis.map((kpi) => (
                <div
                  key={kpi.id}
                  className="text-center p-6 rounded-3xl"
                  style={{ background: `${color}08`, border: `1px solid ${color}20` }}
                >
                  <div
                    className="font-display text-3xl font-bold mb-2"
                    style={{ color }}
                  >
                    {kpi.metric_value}{kpi.metric_unit ?? ""}
                  </div>
                  <div className="text-sm text-gray-500 leading-tight">{kpi.metric_label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Narrative */}
      <section className="py-20 bg-brand-muted">
        <div className="section-container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              {/* Challenge */}
              {cs.challenge && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-brand-red mb-4">
                    The Challenge
                  </div>
                  <p className="text-gray-700 leading-relaxed">{cs.challenge}</p>
                </div>
              )}

              {/* Solution */}
              {cs.solution && (
                <div>
                  <div
                    className="text-xs font-bold uppercase tracking-widest mb-4"
                    style={{ color }}
                  >
                    Our Solution
                  </div>
                  <p className="text-gray-700 leading-relaxed">{cs.solution}</p>
                </div>
              )}

              {/* Impact */}
              {cs.impact && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-green-600 mb-4">
                    The Impact
                  </div>
                  <p className="text-gray-700 leading-relaxed">{cs.impact}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tech */}
              {technologies.length > 0 && (
                <div className="card-enterprise p-6">
                  <h3 className="font-semibold text-brand-navy mb-4">Technology Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((t) => (
                      <span
                        key={t.id}
                        className="px-3 py-1 rounded-full bg-brand-muted border border-gray-200 text-xs font-medium text-gray-600"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonial */}
              {testimonial && (
                <div
                  className="rounded-3xl p-6"
                  style={{ background: `${color}08`, border: `1px solid ${color}20` }}
                >
                  <div
                    className="text-3xl font-serif leading-none mb-3"
                    style={{ color }}
                  >
                    &ldquo;
                  </div>
                  <p className="text-sm text-gray-700 italic leading-relaxed mb-4">
                    {testimonial.quote}
                  </p>
                  <p className="text-xs font-semibold text-gray-500">
                    — {testimonial.client_name}
                  </p>
                </div>
              )}

              {/* Project icon */}
              <div className="card-enterprise p-6 text-center">
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="w-10 h-10" style={{ color }} />
                </div>
                <p className="text-sm text-gray-500">{cs.client_name}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More case studies */}
      {others.length > 0 && (
        <section className="py-16 bg-white">
          <div className="section-container">
            <h2 className="font-display text-2xl font-bold text-brand-navy mb-8">
              More Case Studies
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((other) => {
                const otherColor = getCaseStudyAccent(other.slug);
                return (
                  <Link
                    key={other.slug}
                    href={`/case-studies/${other.slug}`}
                    className="group card-enterprise p-6 block"
                  >
                    <div className="h-1.5 rounded-full mb-5" style={{ background: otherColor }} />
                    <div
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: otherColor }}
                    >
                      {other.industry?.name ?? "Case Study"}
                    </div>
                    <h3 className="font-display font-bold text-lg text-brand-navy mb-2 group-hover:text-brand-red transition-colors">
                      {other.title}
                    </h3>
                    <p className="text-sm text-gray-500">{other.tagline}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-brand">
        <div className="section-container text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Want results like these?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            Let&apos;s start with a free 45-minute discovery session. We&apos;ll understand
            your challenge and share how we&apos;d approach it.
          </p>
          <Link href="/consultation" className="btn-primary !px-10 !py-4 text-base">
            Book a free strategy call <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
