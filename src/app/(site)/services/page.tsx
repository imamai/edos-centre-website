import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getServices } from "@/lib/queries";
import { getIcon, getServiceAccent } from "@/lib/icon-map";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Data Analytics, Engineering & SaaS Development Services in Kenya",
  description: "Explore Edos Centre's full suite of data analytics, data engineering, SaaS development, and digital transformation services for organizations in Kenya.",
  alternates: { canonical: absoluteUrl("/services") },
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative text-center">
          <div className="section-eyebrow justify-center text-brand-red mb-4">
            <span className="w-4 h-px bg-brand-red" /> Solutions <span className="w-4 h-px bg-brand-red" />
          </div>
          <h1 className="font-display text-display-lg font-bold text-white mb-6 text-balance">
            Every digital capability<br />under one roof
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed mb-8">
            From capturing the first data point to delivering boardroom-ready intelligence —
            Edos Centre covers the complete digital transformation stack.
          </p>
          <Link href="/consultation" className="btn-primary text-base !px-8 !py-4">
            Book a Strategy Call <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 bg-brand-muted">
        <div className="section-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const Icon = getIcon(s.icon);
              const color = getServiceAccent(s.slug);
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group card-enterprise p-6 block"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `${color}15` }}>
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <h2 className="font-display font-bold text-xl text-brand-navy mb-1 group-hover:text-brand-red transition-colors">{s.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">{s.tagline}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red group-hover:gap-2.5 transition-all">
                    View service <ArrowRight className="w-4 h-4" />
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
