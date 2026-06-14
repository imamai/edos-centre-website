import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Video, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources — Guides, Whitepapers & Tools",
  description: "Free guides, whitepapers, checklists and tools from Edos Centre on data engineering, M&E systems, DHIS2 and digital transformation in East Africa.",
};

const RESOURCE_TYPES = [
  {
    type:        "guide",
    icon:        BookOpen,
    color:       "#2E234F",
    label:       "Guides",
    description: "Step-by-step practical guides for implementing data systems",
  },
  {
    type:        "whitepaper",
    icon:        FileText,
    color:       "#E31E24",
    label:       "Whitepapers",
    description: "In-depth research and analysis on data strategy",
  },
  {
    type:        "webinar",
    icon:        Video,
    color:       "#6B5B95",
    label:       "Webinars",
    description: "Recorded sessions from our technical workshops",
  },
  {
    type:        "template",
    icon:        Download,
    color:       "#22c55e",
    label:       "Templates",
    description: "Ready-to-use M&E frameworks and data schemas",
  },
];

const RESOURCES = [
  {
    type:        "guide",
    title:       "The Complete DHIS2 Implementation Guide for Counties",
    description: "A step-by-step guide to planning, configuring and deploying DHIS2 for county-level health reporting — from metadata design to user training.",
    tags:        ["DHIS2", "Healthcare", "Implementation"],
    color:       "#2E234F",
    readTime:    "25 min read",
    href:        "/blog/dhis2-api-guide",
  },
  {
    type:        "guide",
    title:       "KoboToolbox Setup Guide for NGO M&E Teams",
    description: "How to design, test and deploy KoboToolbox forms for field data collection — including offline setup, team management and DHIS2 integration.",
    tags:        ["KoboToolbox", "M&E Systems", "ODK"],
    color:       "#2E234F",
    readTime:    "18 min read",
    href:        "/blog/kobo-vs-google-forms",
  },
  {
    type:        "whitepaper",
    title:       "Data Governance for African Health Systems",
    description: "How county health departments can implement data quality frameworks, audit controls, and Kenya Data Protection Act compliance for health data.",
    tags:        ["Data Governance", "Healthcare", "Compliance"],
    color:       "#E31E24",
    readTime:    "30 min read",
    href:        "/blog/health-data-lake-architecture",
  },
  {
    type:        "whitepaper",
    title:       "The Business Case for a Data Warehouse in East Africa",
    description: "ROI analysis and architecture patterns for organisations considering their first data warehouse investment — comparing build vs. buy approaches.",
    tags:        ["Data Engineering", "Strategy", "Analytics"],
    color:       "#E31E24",
    readTime:    "22 min read",
    href:        "/blog/superset-vs-power-bi",
  },
  {
    type:        "template",
    title:       "NGO M&E System Requirements Checklist",
    description: "A 15-point checklist to work through before commissioning an M&E system — covering programme design, data collection, reporting and change management.",
    tags:        ["M&E Systems", "NGOs", "Planning"],
    color:       "#22c55e",
    readTime:    "7 min read",
    href:        "/blog/ngo-me-system-checklist",
  },
  {
    type:        "template",
    title:       "Supabase Multi-Tenant SaaS Architecture Template",
    description: "Schema design, RLS policies and billing integration patterns for building a production-grade multi-tenant SaaS on Supabase — based on EdosPoa.",
    tags:        ["SaaS", "Supabase", "Architecture"],
    color:       "#22c55e",
    readTime:    "14 min read",
    href:        "/blog/supabase-multitenant-architecture",
  },
];

const TYPE_COLORS: Record<string, string> = {
  guide:      "#2E234F",
  whitepaper: "#E31E24",
  webinar:    "#6B5B95",
  template:   "#22c55e",
};

export default function ResourcesPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative text-center">
          <div className="section-eyebrow justify-center text-brand-red mb-4">
            <span className="w-4 h-px bg-brand-red" /> Resources <span className="w-4 h-px bg-brand-red" />
          </div>
          <h1 className="font-display text-display-lg font-bold text-white mb-6 text-balance">
            Free knowledge from<br />real implementations
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Guides, whitepapers, checklists and templates distilled from 10+ years of building
            data systems across East Africa. No fluff, no sales pitch.
          </p>
        </div>
      </section>

      {/* Resource type filters */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {RESOURCE_TYPES.map((rt) => {
              const Icon = rt.icon;
              return (
                <div key={rt.type} className="card-enterprise p-5 text-center">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: `${rt.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: rt.color }} />
                  </div>
                  <div className="font-display font-bold text-brand-navy text-sm mb-1">
                    {rt.label}
                  </div>
                  <p className="text-xs text-gray-500 leading-snug">{rt.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resources grid */}
      <section className="py-20 bg-brand-muted">
        <div className="section-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESOURCES.map((r) => {
              const color = TYPE_COLORS[r.type] ?? "#2E234F";
              return (
                <Link
                  key={r.title}
                  href={r.href}
                  className="group card-enterprise p-6 block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: `${color}15`, color }}
                    >
                      {r.type}
                    </span>
                    <span className="text-xs text-gray-400">{r.readTime}</span>
                  </div>

                  <h2 className="font-display font-bold text-lg text-brand-navy mb-3 group-hover:text-brand-red transition-colors leading-snug">
                    {r.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
                    {r.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {r.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-medium text-gray-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red group-hover:gap-2.5 transition-all">
                    Read now <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-brand">
        <div className="section-container text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Get new resources in your inbox
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-8">
            We publish practical guides and case studies on data engineering, M&E systems, and
            digital transformation in East Africa — every few weeks, no filler.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Link href="/blog" className="btn-secondary flex-1 justify-center">
              Browse the blog <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="btn-primary flex-1 justify-center">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
