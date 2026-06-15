import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Target, Eye, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Edos Centre",
  description: "Learn about Edos Centre — our mission to embrace data for optimum solutions across East Africa.",
};

const STATS = [
  { value: "2019",  label: "Founded in Nairobi" },
  { value: "50+",   label: "Projects delivered" },
  { value: "7",     label: "Industry verticals" },
  { value: "EAC",   label: "Regional footprint" },
];

const MVV = [
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
    text: "Radical transparency, practical over perfect, African context-first design, and solutions that outlive the project team.",
  },
];

const TEAM = [
  {
    name: "Walter Imamai",
    role: "Founder & Director, Digital Platforms and Data Engineering",
    initials: "WI",
  },
  {
    name: "Wilson Musyoki",
    role: "Data Analytics Lead",
    initials: "WM",
  },
];

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
              Edos Centre is East Africa&apos;s<br />
              <span className="gradient-text">data & digital partner</span>
            </h1>
            <p className="text-xl text-white/65 leading-relaxed max-w-2xl">
              Built by practitioners who know that data alone solves nothing — it takes the right systems,
              the right people, and the right strategy to turn data into decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-brand-navy border-b border-white/10">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {STATS.map((s) => (
              <div key={s.label} className="py-10 px-6 text-center">
                <div className="font-display text-4xl font-black text-white mb-1">{s.value}</div>
                <div className="text-sm text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="text-center mb-14">
            <div className="section-eyebrow mb-3">What drives us</div>
            <h2 className="section-heading text-brand-navy">Mission, Vision &amp; Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {MVV.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="card-enterprise p-8">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${v.color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: v.color }} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-brand-navy mb-3">{v.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{v.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-brand-muted">
        <div className="section-container">
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
                  We started by solving hard problems — DHIS2 implementations that actually worked,
                  M&amp;E systems field teams would actually use, dashboards that told cabinet what they needed to know.
                  Word spread. Edos Centre was born.
                </p>
                <p>
                  Today we combine engineering rigour with deep African institutional knowledge —
                  building systems that work on 3G, handle load-shedding, integrate with M-Pesa,
                  and report to USAID.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/case-studies" className="btn-outline inline-flex">
                  See our work <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Pull quote */}
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
              <blockquote className="font-display text-2xl font-bold text-brand-navy leading-snug mb-6">
                &ldquo;We build systems that outlive the project team — because that&apos;s what
                African institutions actually need.&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red font-bold text-sm">
                  WI
                </div>
                <div>
                  <div className="font-semibold text-brand-navy text-sm">Walter Imamai</div>
                  <div className="text-gray-500 text-xs">Founder, Edos Centre</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="text-center mb-14">
            <div className="section-eyebrow mb-3">The people behind the work</div>
            <h2 className="section-heading text-brand-navy">Leadership</h2>
            <p className="section-subheading text-gray-500 mx-auto text-center mt-3">
              A focused team with deep domain expertise — growing alongside our clients.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="card-enterprise p-8 text-center w-full max-w-xs"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-red to-brand-purple flex items-center justify-center mx-auto mb-5">
                  <span className="font-display font-bold text-xl text-white">{member.initials}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-brand-navy mb-1">{member.name}</h3>
                <p className="text-sm text-gray-500 leading-snug">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners & Clients */}
      <section className="py-20 bg-brand-muted border-t border-gray-100">
        <div className="section-container">
          <div className="text-center mb-12">
            <div className="section-eyebrow mb-3">Partners &amp; Clients</div>
            <h2 className="section-heading text-brand-navy">Trusted by organisations across East Africa</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-16">
            <Image
              src="/partner-Tunu Consulting hub.png"
              alt="TUNU Consulting Hub"
              width={180}
              height={70}
              className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
            <Image
              src="/partner-Mejasan Media Production.jpg"
              alt="Mejasan Media Production"
              width={220}
              height={70}
              className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-navy">
        <div className="section-container text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Work with us</h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            Ready to build something that lasts? Start with a conversation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/consultation" className="btn-primary !px-8 !py-4">
              Book Consultation <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="!px-8 !py-4 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-colors inline-flex items-center gap-2"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
