import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Heart, BarChart3, TrendingUp, Leaf, GraduationCap, Globe,
  ArrowRight, ArrowLeft,
} from "lucide-react";

const CASES = [
  {
    slug:      "county-health-information-system",
    title:     "County Health Information System",
    client:    "County Department of Health",
    industry:  "Healthcare",
    icon:      Heart,
    color:     "#E31E24",
    tagline:   "Unifying 200+ health facilities under one platform",
    duration:  "8 months",
    year:      "2024",
    challenge: "A county health department with 200+ facilities was struggling with fragmented data — patient records existed on paper or in siloed spreadsheets, reporting to the Ministry of Health took weeks, and disease outbreaks could not be tracked in real time. Leadership had no visibility into facility performance or supply chain.",
    solution:  "We deployed an integrated Health Management Information System (HMIS) using DHIS2 as the core reporting layer. Custom ODK forms digitized point-of-care data collection at facilities. An Apache Airflow ETL pipeline aggregated and cleaned data nightly into a central PostgreSQL warehouse. Power BI dashboards gave county leadership real-time visibility across all facilities, with drill-down to individual health unit level.",
    impact:    "Within 90 days of go-live, paper-based reporting was eliminated across all facilities. The county health team now runs weekly data reviews using live dashboards instead of waiting for manual reports. An outbreak alert was detected and contained 2 weeks faster than previously possible.",
    tech:      ["DHIS2", "PostgreSQL", "Power BI", "ODK", "Apache Airflow", "Python"],
    kpis: [
      { label: "Facilities Connected", value: "200+" },
      { label: "Records Digitized",   value: "4.2M" },
      { label: "Report Time Saved",   value: "80%" },
      { label: "System Uptime",       value: "99.9%" },
    ],
    testimonial: {
      quote: "For the first time, I can walk into a meeting and show the Cabinet Secretary exactly what is happening in every health facility in real time. This changed how we work.",
      author: "County Director of Health",
    },
  },
  {
    slug:      "ngo-me-platform",
    title:     "NGO M&E Platform",
    client:    "International Development NGO",
    industry:  "NGOs & Development",
    icon:      TrendingUp,
    color:     "#6B5B95",
    tagline:   "Donor-ready impact reporting in real time",
    duration:  "5 months",
    year:      "2024",
    challenge: "A major international development NGO was spending 3 weeks each quarter compiling donor reports from field officers' WhatsApp messages, Excel files and paper forms. Indicator calculations were done manually, leading to frequent errors and donor concerns about data quality. Programme staff had no real-time visibility into whether targets were being met.",
    solution:  "We designed a full M&E system with KoboToolbox for field data collection, a Django backend for beneficiary management and automated indicator calculation, and a dbt-powered data warehouse. An Apache Superset donor dashboard gave programme directors and funders drill-down visibility into every indicator, geographic area and time period. Automated weekly and quarterly reports were generated and emailed directly to donors.",
    impact:    "Donor report generation dropped from 3 weeks to 4 hours. The NGO's programme director could monitor indicator progress daily rather than waiting for quarterly reviews. Data quality issues dropped by 95% due to validation rules built into KoboToolbox forms.",
    tech:      ["KoboToolbox", "Django", "PostgreSQL", "Superset", "dbt", "Python", "Celery"],
    kpis: [
      { label: "Beneficiaries Tracked", value: "85K" },
      { label: "Indicators Automated",  value: "120+" },
      { label: "Report Lead Time",      value: "−93%" },
      { label: "Data Quality Score",    value: "98.5%" },
    ],
    testimonial: {
      quote: "Our donor relationships improved significantly because we could now answer any question about programme progress in minutes. Edos Centre built exactly what we needed.",
      author: "Programme Director, International NGO",
    },
  },
  {
    slug:      "agricultural-reporting-system",
    title:     "Agricultural Reporting System",
    client:    "County Agriculture Department",
    industry:  "Agriculture",
    icon:      Leaf,
    color:     "#22c55e",
    tagline:   "Smallholder farmer data at county scale",
    duration:  "6 months",
    year:      "2023",
    challenge: "A county agriculture department had no digital record of the 15,000+ smallholder farmers it was meant to serve. Crop losses went unreported, fertiliser and seed subsidies were distributed manually with no traceability, and cabinet-level agricultural reports were based on guesswork rather than data.",
    solution:  "We designed a farmer registry application built on ODK for field officers to register farmers with GPS-tagged farm plots on Android devices — fully offline. A Django backend processed registrations, validated data, and exposed a React Native mobile app for continuous farm monitoring. A subsidy distribution module tracked every input issued, creating an auditable chain. Power BI dashboards gave the department head and cabinet real-time situational awareness.",
    impact:    "15,000 farmers were digitally registered within 4 months. The GPS-tagged farm plot data enabled the first accurate county crop area estimates. Subsidy leakage reduced by 45% due to digital audit trails. The county became a pilot for the national digital agriculture programme.",
    tech:      ["ODK", "Django", "React Native", "PostgreSQL", "Power BI", "Python"],
    kpis: [
      { label: "Farmers Registered", value: "15K" },
      { label: "Farm Plots Mapped",  value: "22K" },
      { label: "Subsidy Leakage",    value: "−45%" },
      { label: "Coverage",           value: "3 Counties" },
    ],
    testimonial: {
      quote: "We finally have a farmer registry that is accurate, auditable and updatable. The subsidy leakage we eliminated alone paid for this project several times over.",
      author: "County Director of Agriculture",
    },
  },
  {
    slug:      "school-management-system",
    title:     "School Management System",
    client:    "Private School Network (5 Campuses)",
    industry:  "Education",
    icon:      GraduationCap,
    color:     "#f59e0b",
    tagline:   "Paperless school administration at scale",
    duration:  "4 months",
    year:      "2023",
    challenge: "A 5-campus private school network was running entirely on paper and Excel. Fee collection involved cash queues, receipts were handwritten, academic results were computed manually, and parents had no visibility into their child's progress. The Finance Director could not get a real-time view of fee arrears across campuses.",
    solution:  "We built a multi-campus School Management System on Next.js and Supabase with full M-Pesa STK Push integration for fee payment. The system included student admission, academic records, examination result computation, teacher attendance, and a parent portal with real-time grade notifications via SMS. A Finance dashboard showed arrears, collection rates and projections across all 5 campuses in real time.",
    impact:    "Fee collection time dropped by 70% with M-Pesa integration. Admin headcount was not reduced, but the same team now manages 60% more students. Parents consistently cite the grade notifications as the most valued feature. The network is expanding to 3 more campuses on the same platform.",
    tech:      ["Next.js", "Supabase", "M-Pesa", "PostgreSQL", "React Native", "TypeScript"],
    kpis: [
      { label: "Students on Platform", value: "3,200" },
      { label: "Fee Collection Speed", value: "+70%" },
      { label: "Admin Time Saved",     value: "60%" },
      { label: "Campuses Managed",     value: "5" },
    ],
    testimonial: {
      quote: "The M-Pesa integration alone was worth every shilling. But what surprised me most was how fast parents adopted the parent portal — they love knowing their child's results instantly.",
      author: "School Network Director",
    },
  },
  {
    slug:      "enterprise-saas-platform",
    title:     "Enterprise SaaS Platform (EdosPoa)",
    client:    "Multi-Tenant Retail SaaS",
    industry:  "Retail & Technology",
    icon:      Globe,
    color:     "#06b6d4",
    tagline:   "Multi-tenant POS and inventory for East Africa",
    duration:  "12 months",
    year:      "2022–2023",
    challenge: "East African retail businesses needed a Point of Sale and inventory management solution that worked offline, supported M-Pesa payments, handled multi-branch operations, and complied with Kenya Revenue Authority eTIMS requirements. The existing options were too expensive, too complex, or not designed for the East African context.",
    solution:  "We designed and built EdosPoa — a full multi-tenant SaaS platform with real-time inventory sync across branches, M-Pesa STK Push and card payments, automated KRA eTIMS receipt generation, multi-currency support, and a business analytics dashboard. The architecture uses Supabase with row-level security for full tenant isolation. An Electron desktop app handles offline scenarios. New tenants can onboard and go live in under 30 minutes.",
    impact:    "EdosPoa now serves 50+ businesses across Kenya. The platform has processed over 500 million records with 99.9% uptime. Multiple customers have reduced their accounting close time from weeks to days. The eTIMS module made KRA compliance automatic rather than a monthly manual exercise.",
    tech:      ["Next.js", "Supabase", "M-Pesa", "Stripe", "PostgreSQL", "KRA eTIMS", "Electron", "TypeScript"],
    kpis: [
      { label: "Tenant Businesses", value: "50+" },
      { label: "Records Processed", value: "500M+" },
      { label: "System Uptime",     value: "99.9%" },
      { label: "Branches Managed",  value: "120+" },
    ],
    testimonial: {
      quote: "EdosPoa handles our 12 branches, our M-Pesa reconciliation, and KRA eTIMS automatically. It replaced three separate systems we were using before.",
      author: "Operations Manager, Retail Chain",
    },
  },
  {
    slug:      "county-analytics-dashboard",
    title:     "County Executive Dashboard",
    client:    "County Government",
    industry:  "Government",
    icon:      BarChart3,
    color:     "#2E234F",
    tagline:   "Cabinet-level KPI visibility across all departments",
    duration:  "5 months",
    year:      "2024",
    challenge: "A county governor's office had no consolidated view of performance across Health, Education, Agriculture, Finance and Infrastructure. Department heads presented data in PowerPoint slides at monthly meetings. Cross-sector performance gaps were invisible, and decisions were delayed because data was never ready in time.",
    solution:  "We designed a county-wide integrated KPI dashboard by mapping 85 cross-departmental indicators and building REST API integrations into 7 source systems including DHIS2, the financial management system, and the agriculture registry. Apache Airflow orchestrated nightly ETL runs. A Power BI dashboard with drill-down to sub-county and ward level gave the governor's office instant strategic visibility.",
    impact:    "The county executive now runs weekly data-driven performance reviews instead of monthly PowerPoint presentations. Three underperforming wards were identified within the first month and targeted interventions deployed. The dashboard became the source of truth for the Annual Development Plan reporting.",
    tech:      ["Power BI", "Apache Airflow", "PostgreSQL", "DHIS2 API", "REST APIs", "Python"],
    kpis: [
      { label: "Departments Integrated", value: "7" },
      { label: "KPIs Tracked",           value: "85" },
      { label: "Data Sources",           value: "12+" },
      { label: "Review Time Saved",      value: "−70%" },
    ],
    testimonial: {
      quote: "I can now see how every ward in the county is performing on health, education and revenue — on my phone, in real time. This is the governance tool we needed.",
      author: "County Executive Committee Member",
    },
  },
];

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = CASES.find((c) => c.slug === slug);
  if (!cs) return { title: "Case Study Not Found" };
  return {
    title: `${cs.title} — Edos Centre Case Study`,
    description: cs.tagline,
  };
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const cs = CASES.find((c) => c.slug === slug);
  if (!cs) notFound();

  const Icon = cs.icon;

  const others = CASES.filter((c) => c.slug !== cs.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Case Studies
          </Link>

          <div className="max-w-3xl">
            <div
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: cs.color }}
            >
              {cs.industry} · {cs.year} · {cs.duration}
            </div>
            <h1 className="font-display text-display-md font-bold text-white mb-4 text-balance">
              {cs.title}
            </h1>
            <p className="text-lg text-white/70 font-medium mb-6">{cs.tagline}</p>
            <p className="text-sm text-white/50">Client: {cs.client}</p>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="py-12 border-b border-gray-100 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {cs.kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="text-center p-6 rounded-3xl"
                style={{ background: `${cs.color}08`, border: `1px solid ${cs.color}20` }}
              >
                <div
                  className="font-display text-3xl font-bold mb-2"
                  style={{ color: cs.color }}
                >
                  {kpi.value}
                </div>
                <div className="text-sm text-gray-500 leading-tight">{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="py-20 bg-brand-muted">
        <div className="section-container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              {/* Challenge */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-brand-red mb-4">
                  The Challenge
                </div>
                <p className="text-gray-700 leading-relaxed">{cs.challenge}</p>
              </div>

              {/* Solution */}
              <div>
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-4"
                  style={{ color: cs.color }}
                >
                  Our Solution
                </div>
                <p className="text-gray-700 leading-relaxed">{cs.solution}</p>
              </div>

              {/* Impact */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-green-600 mb-4">
                  The Impact
                </div>
                <p className="text-gray-700 leading-relaxed">{cs.impact}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tech */}
              <div className="card-enterprise p-6">
                <h3 className="font-semibold text-brand-navy mb-4">Technology Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {cs.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-brand-muted border border-gray-200 text-xs font-medium text-gray-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              {cs.testimonial && (
                <div
                  className="rounded-3xl p-6"
                  style={{ background: `${cs.color}08`, border: `1px solid ${cs.color}20` }}
                >
                  <div
                    className="text-3xl font-serif leading-none mb-3"
                    style={{ color: cs.color }}
                  >
                    &ldquo;
                  </div>
                  <p className="text-sm text-gray-700 italic leading-relaxed mb-4">
                    {cs.testimonial.quote}
                  </p>
                  <p className="text-xs font-semibold text-gray-500">
                    — {cs.testimonial.author}
                  </p>
                </div>
              )}

              {/* Project icon */}
              <div className="card-enterprise p-6 text-center">
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${cs.color}15` }}
                >
                  <Icon className="w-10 h-10" style={{ color: cs.color }} />
                </div>
                <p className="text-sm text-gray-500">{cs.client}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More case studies */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <h2 className="font-display text-2xl font-bold text-brand-navy mb-8">
            More Case Studies
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/case-studies/${other.slug}`}
                className="group card-enterprise p-6 block"
              >
                <div className="h-1.5 rounded-full mb-5" style={{ background: other.color }} />
                <div
                  className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: other.color }}
                >
                  {other.industry}
                </div>
                <h3 className="font-display font-bold text-lg text-brand-navy mb-2 group-hover:text-brand-red transition-colors">
                  {other.title}
                </h3>
                <p className="text-sm text-gray-500">{other.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
