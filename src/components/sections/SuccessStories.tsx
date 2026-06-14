"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, BarChart3, TrendingUp, Leaf, GraduationCap, Globe, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CASES = [
  {
    slug:     "county-health-information-system",
    title:    "County Health Information System",
    client:   "County Department of Health",
    icon:     Heart,
    color:    "#E31E24",
    tagline:  "Unifying 200+ health facilities under one platform",
    challenge: "Patient data scattered across 200+ facilities with no central visibility, causing duplicate consultations and reporting errors.",
    solution:  "Deployed an integrated HMIS using DHIS2, custom ETL pipelines, and a Power BI decision dashboard for county health leadership.",
    impact:    "County leadership now has real-time health metrics. Paper-based reporting eliminated across all facilities.",
    tech:      ["DHIS2", "PostgreSQL", "Power BI", "ODK", "Apache Airflow"],
    kpis: [
      { label: "Facilities Connected", value: "200+" },
      { label: "Records Digitized",   value: "4.2M" },
      { label: "Report Time Saved",   value: "80%" },
      { label: "System Uptime",       value: "99.9%" },
    ],
  },
  {
    slug:     "ngo-me-platform",
    title:    "NGO M&E Platform",
    client:   "International Development NGO",
    icon:     TrendingUp,
    color:    "#6B5B95",
    tagline:  "Donor-ready impact reporting in real time",
    challenge: "Programme data collected on paper, reported to donors weeks late with frequent inaccuracies.",
    solution:  "Built a full M&E system with KoboToolbox for field data, automated indicator calculations, and a donor-facing dashboard with drill-down capability.",
    impact:    "Donor report generation dropped from 3 weeks to 4 hours. Programme visibility increased 10×.",
    tech:      ["KoboToolbox", "Django", "PostgreSQL", "Superset", "dbt"],
    kpis: [
      { label: "Beneficiaries Tracked", value: "85K" },
      { label: "Indicators Automated",  value: "120+" },
      { label: "Report Lead Time",      value: "−93%" },
      { label: "Data Quality Score",    value: "98.5%" },
    ],
  },
  {
    slug:     "agricultural-reporting-system",
    title:    "Agricultural Reporting System",
    client:   "County Agriculture Department",
    icon:     Leaf,
    color:    "#22c55e",
    tagline:  "Smallholder farmer data at county scale",
    challenge: "No digital farmer registry, crop losses unreported, subsidy distribution untraceable.",
    solution:  "Designed a farmer registry app on ODK + Django backend, with geo-tagged farm plots, crop monitoring and subsidy distribution tracking.",
    impact:    "15,000 farmers digitally registered, subsidy leakage reduced, real-time crop situation reporting to cabinet.",
    tech:      ["ODK", "Django", "React Native", "PostgreSQL", "Power BI"],
    kpis: [
      { label: "Farmers Registered", value: "15K" },
      { label: "Farm Plots Mapped",  value: "22K" },
      { label: "Subsidy Leakage",    value: "−45%" },
      { label: "Coverage",           value: "3 Counties" },
    ],
  },
  {
    slug:     "school-management-system",
    title:    "School Management System",
    client:   "Private School Network",
    icon:     GraduationCap,
    color:    "#f59e0b",
    tagline:  "Paperless school administration at scale",
    challenge: "Manual fee collection, exam result processing, and teacher attendance tracking across 5 campuses.",
    solution:  "Deployed a multi-campus SaaS SMS with fee management, M-Pesa integration, academic records, and a parent communication portal.",
    impact:    "Fee collection efficiency improved by 70%. Parents receive real-time grade notifications. Admin workload cut by 60%.",
    tech:      ["Next.js", "Supabase", "M-Pesa", "PostgreSQL", "React Native"],
    kpis: [
      { label: "Students on Platform", value: "3,200" },
      { label: "Fee Collection Speed", value: "+70%" },
      { label: "Admin Time Saved",     value: "60%" },
      { label: "Parent Engagement",    value: "5 Campuses" },
    ],
  },
  {
    slug:     "enterprise-saas-platform",
    title:    "Enterprise SaaS Platform",
    client:   "Retail Chain – EdosPoa",
    icon:     Globe,
    color:    "#06b6d4",
    tagline:  "Multi-tenant POS and inventory for East Africa",
    challenge: "Retail chain needed a single platform for POS, inventory, expenses, and real-time branch analytics across multiple cities.",
    solution:  "Built a full multi-tenant SaaS with real-time inventory sync, M-Pesa + card payments, multi-branch analytics, and an eTIMS KRA compliance module.",
    impact:    "Product now serves 50+ businesses. 500M+ records processed. Industry-leading uptime.",
    tech:      ["Next.js", "Supabase", "M-Pesa", "Stripe", "PostgreSQL", "KRA eTIMS"],
    kpis: [
      { label: "Tenant Businesses", value: "50+" },
      { label: "Records Processed", value: "500M+" },
      { label: "System Uptime",     value: "99.9%" },
      { label: "Branches Managed",  value: "120+" },
    ],
  },
  {
    slug:     "county-analytics-dashboard",
    title:    "County Executive Dashboard",
    client:   "County Government",
    icon:     BarChart3,
    color:    "#2E234F",
    tagline:  "Cabinet-level KPI visibility across all departments",
    challenge: "County executive had no consolidated view of performance across health, education, agriculture, and finance.",
    solution:  "Designed a county-wide KPI dashboard integrating 7 department data sources via REST APIs and ETL pipelines into a single executive view.",
    impact:    "Cabinet KPI reviews now data-driven. Cross-sector performance gaps visible and actionable in real time.",
    tech:      ["Power BI", "Apache Airflow", "PostgreSQL", "DHIS2 API", "REST APIs"],
    kpis: [
      { label: "Departments Integrated", value: "7" },
      { label: "KPIs Tracked",           value: "85" },
      { label: "Data Sources",           value: "12+" },
      { label: "Review Time",            value: "−70%" },
    ],
  },
];

export default function SuccessStories() {
  const [active, setActive] = useState(0);
  const cs = CASES[active];

  return (
    <section className="py-24 bg-brand-muted">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="section-eyebrow">Success Stories</div>
            <h2 className="section-heading text-brand-navy">
              Real projects. Measurable impact.
            </h2>
          </div>
          <Link href="/case-studies" className="btn-outline shrink-0">
            All case studies <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Case study tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CASES.map((c, i) => {
            const Icon = c.icon;
            return (
              <button
                key={c.slug}
                onClick={() => setActive(i)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border shrink-0",
                  i === active
                    ? "bg-brand-navy text-white border-brand-navy shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300",
                )}
              >
                <Icon className="w-4 h-4" style={{ color: i === active ? cs.color : undefined }} />
                {c.title.split(" ").slice(0, 3).join(" ")}
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Main */}
            <div className="lg:col-span-2 card-enterprise p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${cs.color}15` }}>
                  <cs.icon className="w-7 h-7" style={{ color: cs.color }} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-1 text-gray-400">{cs.client}</div>
                  <h3 className="font-display text-xl font-bold text-brand-navy">{cs.title}</h3>
                  <p className="text-sm text-brand-red font-medium mt-1">{cs.tagline}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">Challenge</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{cs.challenge}</p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Solution</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{cs.solution}</p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Impact</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{cs.impact}</p>
                </div>
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 pt-5 border-t border-gray-100">
                {cs.tech.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">{t}</span>
                ))}
                <Link href={`/case-studies/${cs.slug}`} className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:gap-2.5 transition-all">
                  Full story <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* KPIs */}
            <div className="space-y-4">
              <div className="rounded-3xl border border-gray-100 bg-white p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Key Results</div>
                <div className="grid grid-cols-2 gap-4">
                  {cs.kpis.map((kpi) => (
                    <div key={kpi.label} className="text-center p-3 rounded-2xl bg-brand-muted">
                      <div className="font-display text-2xl font-bold text-brand-navy" style={{ color: cs.color }}>{kpi.value}</div>
                      <div className="text-xs text-gray-500 mt-1 leading-tight">{kpi.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <button
                  onClick={() => setActive((a) => (a - 1 + CASES.length) % CASES.length)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-brand-muted transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button
                  onClick={() => setActive((a) => (a + 1) % CASES.length)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-brand-muted transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
