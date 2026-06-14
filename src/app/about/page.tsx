import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Eye, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Edos Centre",
  description: "Learn about Edos Centre — our mission to embrace data for optimum solutions across East Africa.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-24 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative">
          <div className="max-w-3xl">
            <div className="section-eyebrow text-brand-red mb-4">About Us</div>
            <h1 className="font-display text-display-lg font-bold text-white mb-6">
              We exist to make data work for<br />
              <span className="gradient-text">African organizations</span>
            </h1>
            <p className="text-xl text-white/65 leading-relaxed max-w-2xl">
              Edos Centre was built by practitioners who know that data alone solves nothing.
              It takes the right systems, the right people, and the right strategy to turn data into decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Target,
                color: "#E31E24",
                title: "Our Mission",
                text: "To transform data into insights, software into impact, and digital challenges into scalable solutions — empowering organizations across East Africa to make better decisions, faster.",
              },
              {
                icon: Eye,
                color: "#2E234F",
                title: "Our Vision",
                text: "A data-driven East Africa where every government department, healthcare facility, NGO, and business makes evidence-based decisions with confidence.",
              },
              {
                icon: Heart,
                color: "#6B5B95",
                title: "Our Values",
                text: "We believe in radical transparency, practical over perfect, African context-first design, and solutions that outlive the project team.",
              },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="card-enterprise p-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${v.color}15` }}>
                    <Icon className="w-7 h-7" style={{ color: v.color }} />
                  </div>
                  <h2 className="font-display font-bold text-xl text-brand-navy mb-3">{v.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{v.text}</p>
                </div>
              );
            })}
          </div>

          {/* Story */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-eyebrow mb-4">Our Story</div>
              <h2 className="section-heading text-brand-navy mb-6">
                Born in the field, built for scale
              </h2>
              <div className="space-y-5 text-gray-600 leading-relaxed">
                <p>
                  Edos Centre was founded by data professionals who spent years in the trenches of
                  East African health systems, NGO monitoring, and government digital transformation.
                  We saw the same gap everywhere: brilliant people, important missions, terrible data infrastructure.
                </p>
                <p>
                  We started by solving hard data problems — DHIS2 implementations that actually worked,
                  M&E systems field teams would actually use, dashboards that told cabinet what they needed to know.
                  Word spread. Requests came. Edos Centre was born.
                </p>
                <p>
                  Today we combine engineering rigour with deep African institutional knowledge.
                  We build systems that work on 3G, handle load-shedding, integrate with M-Pesa,
                  and report to USAID — because that&apos;s the reality of our clients.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: "2019", l: "Founded in Nairobi" },
                { v: "50+",  l: "Completed projects" },
                { v: "7",    l: "Industry verticals" },
                { v: "EAC",  l: "Regional footprint" },
              ].map((s) => (
                <div key={s.l} className="rounded-3xl bg-brand-muted border border-gray-100 p-6 text-center">
                  <div className="font-display text-4xl font-black text-brand-navy mb-1">{s.v}</div>
                  <div className="text-sm text-gray-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-muted">
        <div className="section-container text-center">
          <h2 className="section-heading text-brand-navy mb-4">Work with us</h2>
          <p className="section-subheading text-gray-500 mx-auto text-center mb-8">
            Ready to build something that lasts? Start with a conversation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/consultation" className="btn-primary !px-8 !py-4">
              Book Consultation <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="btn-outline !px-8 !py-4">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
