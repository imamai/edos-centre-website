import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Heart, Building2, GraduationCap, Leaf, Landmark, ShoppingBag, TrendingUp,
  ArrowRight, ArrowLeft, CheckCircle2,
} from "lucide-react";

const INDUSTRIES = [
  {
    slug:        "healthcare",
    icon:        Heart,
    name:        "Healthcare",
    tagline:     "Digitizing Africa's health systems",
    color:       "#E31E24",
    description: "From HMIS implementations to real-time disease surveillance dashboards, we help county health departments, hospitals and national health bodies digitize their operations and generate the evidence needed to improve health outcomes.",
    challenges:  ["Fragmented patient data across facilities", "Weak supply chain visibility", "Manual reporting delays causing policy blind spots", "Lack of real-time outbreak tracking"],
    solutions:   ["Integrated HMIS & EMR platforms", "DHIS2 implementation & customisation", "Supply chain monitoring dashboards", "County health information portals with mobile access"],
    technologies:["DHIS2", "REDCap", "Power BI", "ODK", "PostgreSQL", "KoboToolbox", "Apache Superset"],
    outcomes:    ["90% reduction in paper-based reporting", "Real-time disease surveillance across counties", "Unified patient records accessible from any facility"],
    relatedCases:["county-health-information-system"],
    keyMetrics:  [{ label: "Facilities Connected", value: "200+" }, { label: "Records Processed", value: "4.2M" }, { label: "Report Time Saved", value: "80%" }],
  },
  {
    slug:        "ngos",
    icon:        TrendingUp,
    name:        "NGOs & Development",
    tagline:     "Proof-of-impact for development programs",
    color:       "#6B5B95",
    description: "Development organisations face growing donor pressure for real-time evidence of impact. We build M&E systems, beneficiary databases and donor-ready dashboards that turn field data into compelling proof of results.",
    challenges:  ["Manual donor reporting taking weeks", "Disconnected field data collection tools", "Weak logframe visibility for programme teams", "Manual and error-prone beneficiary tracking"],
    solutions:   ["End-to-end M&E systems with indicator tracking", "KoboToolbox & SurveyCTO form configuration", "Automated donor reporting dashboards", "Centralised beneficiary management platforms"],
    technologies:["KoboToolbox", "Power BI", "DHIS2", "Superset", "Django", "PostgreSQL", "dbt"],
    outcomes:    ["80% faster donor report generation", "Real-time programme indicator tracking", "Centralised beneficiary database with audit trail"],
    relatedCases:["ngo-me-platform"],
    keyMetrics:  [{ label: "Beneficiaries Tracked", value: "85K" }, { label: "Indicators Automated", value: "120+" }, { label: "Report Lead Time", value: "−93%" }],
  },
  {
    slug:        "government",
    icon:        Landmark,
    name:        "Government",
    tagline:     "Data-driven public service delivery",
    color:       "#2E234F",
    description: "County governments and national agencies need integrated data systems that break down departmental silos and give leadership real-time visibility into performance across all sectors — from health and education to revenue and infrastructure.",
    challenges:  ["Siloed departmental data with no central view", "Limited citizen access to government services", "Weak budget and expenditure visibility", "Manual revenue collection gaps and leakage"],
    solutions:   ["County integrated KPI dashboards", "e-Government citizen portals", "Revenue and expenditure management systems", "Cross-department data integration via APIs"],
    technologies:["Next.js", "PostgreSQL", "Power BI", "DHIS2", "REST APIs", "Apache Airflow"],
    outcomes:    ["Cabinet KPI reviews backed by live data", "Citizen self-service portals reducing queue load", "Integrated cross-sector revenue tracking"],
    relatedCases:["county-analytics-dashboard"],
    keyMetrics:  [{ label: "Departments Integrated", value: "7" }, { label: "KPIs Tracked Live", value: "85" }, { label: "Review Time Saved", value: "70%" }],
  },
  {
    slug:        "education",
    icon:        GraduationCap,
    name:        "Education",
    tagline:     "Smart institutions, better learning outcomes",
    color:       "#6B5B95",
    description: "From individual schools to multi-campus networks and county education departments, we build the systems that eliminate paper-based administration, give teachers and parents real-time information, and help identify learners who need support.",
    challenges:  ["Manual student records and academic management", "No early warning systems for at-risk learners", "Weak financial tracking and fee management", "Limited parent-school communication channels"],
    solutions:   ["Full school management systems (SMS)", "Learner analytics and performance dashboards", "Automated fee collection with M-Pesa integration", "Parent communication portals and mobile apps"],
    technologies:["React", "Django", "PostgreSQL", "Power BI", "SMS APIs", "M-Pesa", "Supabase"],
    outcomes:    ["Paperless school administration end-to-end", "70% improvement in fee collection efficiency", "Early identification of learners at risk of dropout"],
    relatedCases:["school-management-system"],
    keyMetrics:  [{ label: "Students on Platform", value: "3,200" }, { label: "Fee Collection Speed", value: "+70%" }, { label: "Admin Time Saved", value: "60%" }],
  },
  {
    slug:        "agriculture",
    icon:        Leaf,
    name:        "Agriculture",
    tagline:     "Data for food security at scale",
    color:       "#22c55e",
    description: "Smallholder farmer data, crop monitoring and agri-value-chain traceability are critical for food security policy. We build farmer registries, crop tracking apps and market price dashboards that put agricultural intelligence in the hands of decision-makers.",
    challenges:  ["Missing smallholder farmer data and registries", "Weak agricultural value-chain traceability", "Limited market price access for farmers", "Manual crop loss and disaster reporting"],
    solutions:   ["Digital farmer registry and crop tracking apps", "Market price aggregation and dashboard systems", "Agri-finance and subsidy distribution tracking", "Climate risk and yield analytics platforms"],
    technologies:["ODK", "Power BI", "React Native", "PostgreSQL", "Python", "REST APIs"],
    outcomes:    ["15,000+ farmers digitally registered", "Real-time market price access in rural areas", "Subsidised input tracking reducing leakage by 45%"],
    relatedCases:["agricultural-reporting-system"],
    keyMetrics:  [{ label: "Farmers Registered", value: "15K" }, { label: "Farm Plots Mapped", value: "22K" }, { label: "Subsidy Leakage", value: "−45%" }],
  },
  {
    slug:        "financial-services",
    icon:        Building2,
    name:        "Financial Services",
    tagline:     "Compliance, analytics & fintech solutions",
    color:       "#f59e0b",
    description: "Banks, SACCOs, microfinance institutions and fintechs need data infrastructure that is both analytically powerful and compliance-ready. We build credit analytics, fraud detection, regulatory reporting and customer 360 platforms.",
    challenges:  ["Manual, error-prone compliance reporting", "Limited credit analytics and scoring capability", "Fraud detection gaps and transaction anomalies", "Siloed customer financial data across systems"],
    solutions:   ["Automated regulatory reporting pipelines", "Credit scoring and risk analytics dashboards", "Real-time fraud detection and alerting systems", "Customer 360 data platforms"],
    technologies:["Python", "Power BI", "PostgreSQL", "FastAPI", "Machine Learning", "Kafka"],
    outcomes:    ["Regulatory submissions fully automated", "Real-time transaction monitoring with anomaly alerts", "Data-driven credit decisions reducing default rates"],
    relatedCases:["enterprise-saas-platform"],
    keyMetrics:  [{ label: "Compliance Automation", value: "100%" }, { label: "Fraud Detection", value: "Real-time" }, { label: "Report Generation", value: "<1 hr" }],
  },
  {
    slug:        "retail",
    icon:        ShoppingBag,
    name:        "Retail & Logistics",
    tagline:     "Inventory intelligence & customer analytics",
    color:       "#06b6d4",
    description: "Retail chains, distributors and e-commerce businesses need real-time inventory visibility, customer loyalty analytics and omnichannel order management. We build the platforms that give you control across every branch and every channel.",
    challenges:  ["Inventory stockouts and warehouse waste", "Weak customer lifetime value and retention insight", "Manual, error-prone supply chain processes", "No unified view across multiple branches"],
    solutions:   ["POS and inventory management systems", "Customer analytics and loyalty programme platforms", "Supply chain monitoring dashboards", "E-commerce and mobile payment integrations"],
    technologies:["Next.js", "PostgreSQL", "Supabase", "M-Pesa", "Power BI", "React Native"],
    outcomes:    ["30% reduction in stockout incidents", "Customer loyalty programme with real-time points", "Multi-branch inventory visible on a single screen"],
    relatedCases:["enterprise-saas-platform"],
    keyMetrics:  [{ label: "Stockout Reduction", value: "30%" }, { label: "Branches Managed", value: "120+" }, { label: "Records Processed", value: "500M+" }],
  },
];

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = INDUSTRIES.find((i) => i.slug === slug);
  if (!industry) return { title: "Industry Not Found" };
  return {
    title: `${industry.name} Solutions — Edos Centre`,
    description: industry.description,
  };
}

export default async function IndustryDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const industry = INDUSTRIES.find((i) => i.slug === slug);
  if (!industry) notFound();

  const Icon = industry.icon;

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Industries
          </Link>

          <div className="flex items-start gap-6 max-w-3xl">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 mt-1"
              style={{ background: `${industry.color}20` }}
            >
              <Icon className="w-10 h-10" style={{ color: industry.color }} />
            </div>
            <div>
              <div
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: industry.color }}
              >
                Industry Solutions
              </div>
              <h1 className="font-display text-display-md font-bold text-white mb-3">
                {industry.name}
              </h1>
              <p className="text-lg text-white/60 font-medium">{industry.tagline}</p>
            </div>
          </div>

          <p className="mt-8 text-base text-white/70 leading-relaxed max-w-2xl">
            {industry.description}
          </p>

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
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="section-container">
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {industry.keyMetrics.map((m) => (
              <div key={m.label} className="text-center">
                <div
                  className="font-display text-3xl font-bold mb-1"
                  style={{ color: industry.color }}
                >
                  {m.value}
                </div>
                <div className="text-sm text-gray-500">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                {industry.challenges.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-brand-red mt-1.5 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div className="card-enterprise p-8">
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-6"
                style={{ color: industry.color }}
              >
                Our Solutions
              </h2>
              <ul className="space-y-4">
                {industry.solutions.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle2
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: industry.color }}
                    />
                    {s}
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
                {industry.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 bg-white">
        <div className="section-container max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl font-bold text-brand-navy mb-8">
            Tools & Technologies
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {industry.technologies.map((t) => (
              <span
                key={t}
                className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 bg-brand-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

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
