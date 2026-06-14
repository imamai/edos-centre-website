"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  BarChart3, Globe, LayoutDashboard, Smartphone, Monitor,
  ClipboardList, Activity, Link2, Cpu, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    slug:         "data-analytics",
    icon:         BarChart3,
    title:        "Data Analytics",
    tagline:      "Turn raw data into competitive advantage",
    description:  "Business intelligence, advanced analytics, KPI frameworks and executive dashboards that drive real decisions.",
    capabilities: ["Power BI", "Apache Superset", "Tableau", "Custom Analytics", "Predictive Models"],
    color:        "#E31E24",
    featured:     true,
  },
  {
    slug:         "data-engineering",
    icon:         Cpu,
    title:        "Data Engineering",
    tagline:      "Build your data backbone",
    description:  "Robust ETL pipelines, data warehouses, data lakes and real-time streaming architectures.",
    capabilities: ["Apache Airflow", "dbt", "PostgreSQL", "BigQuery", "Kafka"],
    color:        "#E31E24",
    featured:     true,
  },
  {
    slug:         "saas-platforms",
    icon:         Globe,
    title:        "SaaS Platforms",
    tagline:      "Multi-tenant cloud applications",
    description:  "End-to-end SaaS development from architecture to deployment — subscription management, billing, white-labelling.",
    capabilities: ["Next.js", "Supabase", "Stripe", "M-Pesa", "Docker"],
    color:        "#2E234F",
    featured:     true,
  },
  {
    slug:         "dashboard-development",
    icon:         LayoutDashboard,
    title:        "Dashboard Development",
    tagline:      "Insight at a glance",
    description:  "Custom operational and strategic dashboards with real-time data, role-based views and mobile optimization.",
    capabilities: ["Power BI", "Superset", "Custom React", "Embedding", "APIs"],
    color:        "#6B5B95",
    featured:     false,
  },
  {
    slug:         "web-development",
    icon:         Globe,
    title:        "Web Development",
    tagline:      "Enterprise-grade web applications",
    description:  "Full-stack web applications, portals, e-commerce and content platforms built for performance and scale.",
    capabilities: ["Next.js", "React", "Django", "FastAPI", "PostgreSQL"],
    color:        "#2E234F",
    featured:     false,
  },
  {
    slug:         "mobile-applications",
    icon:         Smartphone,
    title:        "Mobile Applications",
    tagline:      "iOS & Android at enterprise scale",
    description:  "Cross-platform and native mobile apps with offline capability, push notifications and data sync.",
    capabilities: ["React Native", "Flutter", "Expo", "Firebase", "REST APIs"],
    color:        "#2E234F",
    featured:     false,
  },
  {
    slug:         "desktop-systems",
    icon:         Monitor,
    title:        "Desktop Systems",
    tagline:      "Offline-first enterprise software",
    description:  "Windows and cross-platform desktop applications for environments with limited connectivity.",
    capabilities: ["Electron", "Python", "SQLite", "PyQt", "Tauri"],
    color:        "#6B5B95",
    featured:     false,
  },
  {
    slug:         "questionnaire-digitization",
    icon:         ClipboardList,
    title:        "Questionnaire Digitization",
    tagline:      "Zero paper, maximum data quality",
    description:  "Transform paper-based data collection using ODK, KoboToolbox, SurveyCTO and REDCap.",
    capabilities: ["ODK", "KoboToolbox", "SurveyCTO", "REDCap", "DHIS2 Import"],
    color:        "#6B5B95",
    featured:     false,
  },
  {
    slug:         "monitoring-evaluation",
    icon:         Activity,
    title:        "M&E Systems",
    tagline:      "Measure what matters",
    description:  "End-to-end Monitoring & Evaluation systems with indicator tracking, logframe management and donor reporting.",
    capabilities: ["DHIS2", "KoboToolbox", "Power BI", "Custom M&E", "Results Frameworks"],
    color:        "#E31E24",
    featured:     false,
  },
  {
    slug:         "dhis2-integrations",
    icon:         Link2,
    title:        "DHIS2 Integrations",
    tagline:      "Connect your health systems",
    description:  "Custom DHIS2 configuration, data element setup, analytics apps, API integrations and national system linkages.",
    capabilities: ["DHIS2 API", "Tracker", "Data Elements", "Analytics Apps", "ETL"],
    color:        "#E31E24",
    featured:     false,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const Icon = service.icon;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={cn(
        "group card-enterprise p-6 relative overflow-hidden",
        service.featured ? "lg:row-span-1 ring-1 ring-brand-red/20" : "",
      )}
    >
      {service.featured && (
        <div className="absolute top-4 right-4">
          <span className="badge-red text-[10px]">Featured</span>
        </div>
      )}

      {/* Top bar accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, ${service.color}, transparent)` }} />

      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${service.color}15` }}>
        <Icon className="w-6 h-6" style={{ color: service.color }} />
      </div>

      <h3 className="font-display font-bold text-lg text-brand-navy mb-1">{service.title}</h3>
      <p className="text-xs font-semibold text-gray-400 mb-3">{service.tagline}</p>
      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{service.description}</p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {service.capabilities.slice(0, 3).map((cap) => (
          <span key={cap} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">{cap}</span>
        ))}
        {service.capabilities.length > 3 && (
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 text-xs">+{service.capabilities.length - 3}</span>
        )}
      </div>

      <Link
        href={`/services/${service.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red group-hover:gap-2.5 transition-all duration-200"
      >
        Learn more <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}

export default function SolutionsGrid() {
  return (
    <section className="py-24 bg-brand-muted">
      <div className="section-container">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="section-eyebrow">Solutions</div>
          <h2 className="section-heading text-brand-navy mb-4">
            Every digital capability under one roof
          </h2>
          <p className="section-subheading">
            From collecting the first data point to delivering boardroom-ready intelligence —
            Edos Centre covers the full digital transformation stack.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/services" className="btn-outline">
            View all solutions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
