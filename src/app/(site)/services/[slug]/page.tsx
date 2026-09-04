import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BarChart3, Globe, LayoutDashboard, Smartphone, Monitor,
  ClipboardList, Activity, Link2, Cpu, ArrowRight, CheckCircle2, ArrowLeft,
} from "lucide-react";

const SERVICES = [
  {
    slug:         "data-analytics",
    icon:         BarChart3,
    color:        "#E31E24",
    title:        "Data Analytics",
    tagline:      "Business intelligence & insight platforms",
    description:  "We transform raw data into actionable intelligence — from custom BI dashboards and predictive models to self-service analytics portals that give every decision-maker instant access to the metrics that matter.",
    capabilities: [
      "Custom Power BI & Apache Superset dashboards",
      "KPI scorecards and executive reporting",
      "Self-service analytics portals",
      "Predictive modelling and trend analysis",
      "Data warehouse design and query optimisation",
      "Embedded analytics in existing platforms",
    ],
    technologies: ["Power BI", "Apache Superset", "Tableau", "Metabase", "BigQuery", "PostgreSQL", "dbt", "Python"],
    outcomes: [
      "Decision-making accelerated by 60–80%",
      "Unified view across siloed departments",
      "Dashboards accessible from any device",
    ],
    relatedCases: ["county-health-information-system", "county-analytics-dashboard"],
  },
  {
    slug:         "data-engineering",
    icon:         Cpu,
    color:        "#E31E24",
    title:        "Data Engineering",
    tagline:      "ETL pipelines, lakes & warehouses",
    description:  "We build the data backbone your organisation needs — ingesting data from any source, cleaning and transforming it, and delivering it reliably to the tools that drive decisions.",
    capabilities: [
      "ETL/ELT pipeline design and implementation",
      "Apache Airflow workflow orchestration",
      "dbt data transformation models",
      "Data lake and warehouse architecture",
      "Real-time streaming pipelines",
      "Data quality validation frameworks",
    ],
    technologies: ["Apache Airflow", "dbt", "PostgreSQL", "BigQuery", "Kafka", "Python", "Supabase", "REST APIs"],
    outcomes: [
      "Hours of manual data prep eliminated",
      "Single source of truth established",
      "Pipeline reliability at 99.5%+ uptime",
    ],
    relatedCases: ["county-health-information-system", "ngo-me-platform"],
  },
  {
    slug:         "saas-platforms",
    icon:         Globe,
    color:        "#2E234F",
    title:        "SaaS Platforms",
    tagline:      "Multi-tenant cloud applications",
    description:  "We design and build production-grade, multi-tenant SaaS applications — from architecture and backend APIs to polished frontends and payment integrations, ready to scale from day one.",
    capabilities: [
      "Multi-tenant architecture with row-level security",
      "Subscription billing and M-Pesa / Stripe integration",
      "Role-based access control (RBAC)",
      "REST and GraphQL API development",
      "CI/CD pipelines and cloud deployment",
      "Compliance modules (KRA eTIMS, VAT)",
    ],
    technologies: ["Next.js", "Supabase", "PostgreSQL", "Stripe", "M-Pesa", "Vercel", "GitHub Actions"],
    outcomes: [
      "Go-to-market in 8–14 weeks",
      "Multi-currency, multi-country ready",
      "SOC 2-aligned security architecture",
    ],
    relatedCases: ["enterprise-saas-platform", "school-management-system"],
  },
  {
    slug:         "dashboard-development",
    icon:         LayoutDashboard,
    color:        "#6B5B95",
    title:        "Dashboard Development",
    tagline:      "Operational & strategic dashboards",
    description:  "Purpose-built dashboards that surface the right metrics at the right level — from field-officer operational views to cabinet-level KPI scorecards — designed for clarity, speed and daily use.",
    capabilities: [
      "Executive KPI scorecards",
      "Operational monitoring dashboards",
      "Real-time data refresh (5-min to hourly)",
      "Drill-down and cross-filter interactivity",
      "Mobile-responsive dashboard layouts",
      "Automated PDF/email report delivery",
    ],
    technologies: ["Power BI", "Apache Superset", "Metabase", "Tableau", "React", "Chart.js", "PostgreSQL"],
    outcomes: [
      "C-suite decisions backed by live data",
      "Field teams with mobile-first views",
      "Report generation time cut by 90%",
    ],
    relatedCases: ["county-analytics-dashboard", "ngo-me-platform"],
  },
  {
    slug:         "web-development",
    icon:         Globe,
    color:        "#2E234F",
    title:        "Web Development",
    tagline:      "Enterprise-grade web applications",
    description:  "We build fast, secure, scalable web applications using modern frameworks. From consumer-facing portals to internal enterprise tools, every product is built for performance and long-term maintainability.",
    capabilities: [
      "Next.js and React application development",
      "Server-side rendering (SSR) and static generation",
      "RESTful and GraphQL API integration",
      "Authentication with SSO, OTP and OAuth",
      "Progressive web app (PWA) development",
      "Accessibility (WCAG 2.1 AA) compliance",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Supabase", "Vercel"],
    outcomes: [
      "Core Web Vitals scores in green",
      "Sub-2s page load on mobile",
      "Maintainable, documented codebase",
    ],
    relatedCases: ["enterprise-saas-platform", "school-management-system"],
  },
  {
    slug:         "mobile-applications",
    icon:         Smartphone,
    color:        "#2E234F",
    title:        "Mobile Applications",
    tagline:      "Cross-platform iOS & Android apps",
    description:  "From offline-first field data collection apps to consumer mobile experiences with M-Pesa payments, we build mobile applications that work in the real conditions of East Africa — including low-bandwidth environments.",
    capabilities: [
      "React Native cross-platform development",
      "Offline-first architecture with local sync",
      "M-Pesa STK push and payment integration",
      "Push notification systems",
      "App Store and Google Play deployment",
      "Barcode / QR scanning and camera integration",
    ],
    technologies: ["React Native", "Expo", "SQLite", "M-Pesa", "Firebase", "PostgreSQL", "Supabase"],
    outcomes: [
      "Single codebase for iOS and Android",
      "Full functionality with no internet",
      "M-Pesa-ready from day one",
    ],
    relatedCases: ["agricultural-reporting-system", "school-management-system"],
  },
  {
    slug:         "desktop-systems",
    icon:         Monitor,
    color:        "#6B5B95",
    title:        "Desktop Systems",
    tagline:      "Offline-first Windows applications",
    description:  "For environments where internet connectivity is unreliable or unavailable, we build desktop applications that run fully offline, sync when connected, and integrate with local hardware like receipt printers and barcode scanners.",
    capabilities: [
      "Electron-based cross-platform desktop apps",
      "Offline-first data storage with SQLite",
      "Background sync when connectivity returns",
      "Receipt printer and barcode scanner integration",
      "Automatic update delivery",
      "Windows and macOS deployment packages",
    ],
    technologies: ["Electron", "React", "SQLite", "Node.js", "TypeScript", "PostgreSQL"],
    outcomes: [
      "Zero downtime even without internet",
      "Hardware integration out of the box",
      "Auto-update without IT involvement",
    ],
    relatedCases: ["enterprise-saas-platform"],
  },
  {
    slug:         "questionnaire-digitization",
    icon:         ClipboardList,
    color:        "#6B5B95",
    title:        "Questionnaire Digitization",
    tagline:      "ODK, KoboToolbox & SurveyCTO setup",
    description:  "We replace paper forms with digital data collection tools configured for field use — with skip logic, validation, GPS capture, offline mode and direct integration to your data warehouse or DHIS2.",
    capabilities: [
      "ODK, KoboToolbox and SurveyCTO form design",
      "Skip logic, constraints and validation rules",
      "GPS and media capture configuration",
      "Offline data collection on Android devices",
      "Central submission server setup",
      "Automated DHIS2 / database import pipelines",
    ],
    technologies: ["ODK", "KoboToolbox", "SurveyCTO", "REDCap", "DHIS2", "Python", "PostgreSQL"],
    outcomes: [
      "100% elimination of paper data entry",
      "GPS-tagged field records",
      "Same-day data availability in dashboards",
    ],
    relatedCases: ["county-health-information-system", "ngo-me-platform", "agricultural-reporting-system"],
  },
  {
    slug:         "monitoring-evaluation",
    icon:         Activity,
    color:        "#E31E24",
    title:        "M&E Systems",
    tagline:      "Programme monitoring & results frameworks",
    description:  "We build end-to-end M&E systems aligned to your logical framework — from digital data collection and indicator calculation engines to donor-ready dashboards and automated reports.",
    capabilities: [
      "Logical framework (logframe) digitization",
      "Indicator tracking and automated calculation",
      "Beneficiary registration and management",
      "Donor reporting dashboard development",
      "Programme data collection with KoboToolbox",
      "Mid-term and end-line evaluation support",
    ],
    technologies: ["KoboToolbox", "DHIS2", "Power BI", "Superset", "Django", "PostgreSQL", "dbt"],
    outcomes: [
      "Donor reports generated in hours, not weeks",
      "Real-time programme visibility",
      "Audit-ready data trail for all activities",
    ],
    relatedCases: ["ngo-me-platform", "county-health-information-system"],
  },
  {
    slug:         "dhis2-integrations",
    icon:         Link2,
    color:        "#E31E24",
    title:        "DHIS2 Integrations",
    tagline:      "Health information system setup & APIs",
    description:  "We are specialists in DHIS2 — from fresh national-level deployments and custom metadata configuration to complex API integrations that bridge DHIS2 with external systems, mobile apps and dashboards.",
    capabilities: [
      "DHIS2 server setup and hosting",
      "Metadata configuration (org units, data elements, indicators)",
      "Custom DHIS2 dashboards and analytics",
      "DHIS2 REST API integration with external systems",
      "Tracker programs for case surveillance",
      "Data import/export pipelines",
    ],
    technologies: ["DHIS2", "PostgreSQL", "ODK", "Python", "REST APIs", "Power BI"],
    outcomes: [
      "National/county HMIS fully operational",
      "Zero duplicate data entry between systems",
      "Real-time disease surveillance dashboards",
    ],
    relatedCases: ["county-health-information-system"],
  },
];

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.title} — Edos Centre`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const Icon = service.icon;

  const related = SERVICES.filter(
    (s) => s.slug !== service.slug && s.color === service.color,
  ).slice(0, 3);

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
              style={{ background: `${service.color}20` }}
            >
              <Icon className="w-10 h-10" style={{ color: service.color }} />
            </div>
            <div>
              <div
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: service.color }}
              >
                Service
              </div>
              <h1 className="font-display text-display-md font-bold text-white mb-3 text-balance">
                {service.title}
              </h1>
              <p className="text-lg text-white/60 font-medium">{service.tagline}</p>
            </div>
          </div>

          <p className="mt-8 text-base text-white/70 leading-relaxed max-w-2xl">
            {service.description}
          </p>

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
                {service.capabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-3">
                    <CheckCircle2
                      className="w-5 h-5 shrink-0 mt-0.5"
                      style={{ color: service.color }}
                    />
                    <span className="text-gray-700">{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              {/* Technologies */}
              <div className="card-enterprise p-8">
                <h3 className="font-display font-bold text-lg text-brand-navy mb-5">
                  Technology Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Outcomes */}
              <div
                className="rounded-3xl p-8"
                style={{ background: `${service.color}08`, border: `1px solid ${service.color}20` }}
              >
                <h3
                  className="font-display font-bold text-lg mb-5"
                  style={{ color: service.color }}
                >
                  Expected Outcomes
                </h3>
                <ul className="space-y-3">
                  {service.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-3 text-gray-700 text-sm">
                      <span
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ background: service.color }}
                      />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
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
                const RelIcon = s.icon;
                return (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group card-enterprise p-6 block"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{ background: `${s.color}15` }}
                    >
                      <RelIcon className="w-5 h-5" style={{ color: s.color }} />
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
