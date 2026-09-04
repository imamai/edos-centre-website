import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { getServices, getServiceBySlug } from "@/lib/queries";
import { getIcon, getServiceAccent } from "@/lib/icon-map";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.title} — Edos Centre`,
    description: service.description ?? undefined,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [service, allServices] = await Promise.all([getServiceBySlug(slug), getServices()]);
  if (!service) notFound();

  const Icon = getIcon(service.icon);
  const color = getServiceAccent(service.slug);

  const capabilities = [...(service.edoscentre_service_capabilities ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const outcomes = [...(service.edoscentre_service_outcomes ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const technologies = (service.edoscentre_service_technologies ?? [])
    .map((t) => t.edoscentre_technologies)
    .filter((t): t is NonNullable<typeof t> => !!t);

  const related = allServices
    .filter((s) => s.slug !== service.slug && getServiceAccent(s.slug) === color)
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Solutions
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
                Service
              </div>
              <h1 className="font-display text-display-md font-bold text-white mb-3 text-balance">
                {service.title}
              </h1>
              {service.tagline && <p className="text-lg text-white/60 font-medium">{service.tagline}</p>}
            </div>
          </div>

          {service.description && (
            <p className="mt-8 text-base text-white/70 leading-relaxed max-w-2xl">
              {service.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/consultation" className="btn-primary !px-8 !py-3.5">
              Start a project <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="btn-secondary !px-8 !py-3.5">
              Ask a question
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-brand-muted">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="section-eyebrow">
                <span className="w-4 h-px bg-brand-red" /> What we deliver
              </div>
              <h2 className="font-display text-3xl font-bold text-brand-navy mb-8">
                Capabilities
              </h2>
              <ul className="space-y-4">
                {capabilities.map((cap) => (
                  <li key={cap.id} className="flex items-start gap-3">
                    <CheckCircle2
                      className="w-5 h-5 shrink-0 mt-0.5"
                      style={{ color }}
                    />
                    <span className="text-gray-700">{cap.capability}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              {/* Technologies */}
              {technologies.length > 0 && (
                <div className="card-enterprise p-8">
                  <h3 className="font-display font-bold text-lg text-brand-navy mb-5">
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <span
                        key={tech.id}
                        className="px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-700"
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Outcomes */}
              {outcomes.length > 0 && (
                <div
                  className="rounded-3xl p-8"
                  style={{ background: `${color}08`, border: `1px solid ${color}20` }}
                >
                  <h3
                    className="font-display font-bold text-lg mb-5"
                    style={{ color }}
                  >
                    Expected Outcomes
                  </h3>
                  <ul className="space-y-3">
                    {outcomes.map((outcome) => (
                      <li key={outcome.id} className="flex items-start gap-3 text-gray-700 text-sm">
                        <span
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ background: color }}
                        />
                        {outcome.outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related services */}
      {related.length > 0 && (
        <section className="py-16 bg-white">
          <div className="section-container">
            <h2 className="font-display text-2xl font-bold text-brand-navy mb-8">
              Related Services
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((s) => {
                const RelIcon = getIcon(s.icon);
                const relColor = getServiceAccent(s.slug);
                return (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group card-enterprise p-6 block"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{ background: `${relColor}15` }}
                    >
                      <RelIcon className="w-5 h-5" style={{ color: relColor }} />
                    </div>
                    <h3 className="font-display font-bold text-lg text-brand-navy mb-1 group-hover:text-brand-red transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-sm text-gray-500">{s.tagline}</p>
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
            Ready to get started?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            Tell us about your data challenge. We&apos;ll design a solution and give you a
            clear implementation roadmap — free, no obligation.
          </p>
          <Link href="/consultation" className="btn-primary !px-10 !py-4 text-base">
            Book a free strategy call <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
