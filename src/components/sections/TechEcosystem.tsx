"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Database, Cpu, HardDrive, BarChart3, Globe, Brain,
  ArrowDownToLine, ChevronDown,
} from "lucide-react";

const PIPELINE = [
  {
    id:    "sources",
    label: "Data Sources",
    icon:  Database,
    color: "#6B5B95",
    items: ["ODK Forms", "KoboToolbox", "SurveyCTO", "REDCap", "DHIS2 API", "CSV/Excel", "IoT Sensors"],
    desc:  "Capture data from any source, any format",
  },
  {
    id:    "engineering",
    label: "Data Engineering",
    icon:  Cpu,
    color: "#E31E24",
    items: ["ETL Pipelines", "Apache Airflow", "dbt Transforms", "Data Cleaning", "Validation Rules"],
    desc:  "Clean, transform and orchestrate data flows",
  },
  {
    id:    "storage",
    label: "Storage & Warehousing",
    icon:  HardDrive,
    color: "#E31E24",
    items: ["PostgreSQL", "BigQuery", "Data Lakes", "Supabase", "Time-series DBs"],
    desc:  "Reliable, queryable data at any scale",
  },
  {
    id:    "analytics",
    label: "Analytics & BI",
    icon:  BarChart3,
    color: "#2E234F",
    items: ["Power BI", "Apache Superset", "Tableau", "Metabase", "Custom BI"],
    desc:  "Surface intelligence across your organization",
  },
  {
    id:    "applications",
    label: "Applications",
    icon:  Globe,
    color: "#2E234F",
    items: ["Web Portals", "Mobile Apps", "SaaS Platforms", "Desktop Systems", "APIs"],
    desc:  "Deliver data through purpose-built interfaces",
  },
  {
    id:    "decisions",
    label: "Decision Support",
    icon:  Brain,
    color: "#1A1733",
    items: ["AI Reports", "KPI Scorecards", "Executive Dashboards", "Automated Alerts"],
    desc:  "Empower leaders with instant strategic clarity",
  },
];

function PipelineStep({
  step,
  index,
  isLast,
}: {
  step: typeof PIPELINE[0];
  index: number;
  isLast: boolean;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const Icon = step.icon;

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: index * 0.1, duration: 0.5, ease: "backOut" }}
        className="group w-full max-w-xs rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center hover:border-brand-red/30 transition-all duration-300"
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${step.color}20` }}>
          <Icon className="w-8 h-8" style={{ color: step.color }} />
        </div>

        <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: step.color }}>
          Layer {index + 1}
        </div>
        <h3 className="font-display font-bold text-white text-lg mb-2">{step.label}</h3>
        <p className="text-white/50 text-xs mb-4 leading-relaxed">{step.desc}</p>

        {/* Items */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {step.items.map((item) => (
            <span
              key={item}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ background: `${step.color}15`, color: `${step.color}` }}
            >
              {item}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Arrow connector */}
      {!isLast && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={inView ? { opacity: 1, scaleY: 1 } : {}}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
          className="flex flex-col items-center my-3"
        >
          <div className="w-px h-6 bg-gradient-to-b from-brand-red/50 to-brand-red/0" />
          <ChevronDown className="w-4 h-4 text-brand-red/60" />
        </motion.div>
      )}
    </div>
  );
}

export default function TechEcosystem() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 bg-gradient-brand relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-eyebrow justify-center text-brand-red">
            <span className="w-4 h-px bg-brand-red" />
            Technology Ecosystem
            <span className="w-4 h-px bg-brand-red" />
          </div>
          <h2 className="section-heading text-white mb-4">
            End-to-end data intelligence pipeline
          </h2>
          <p className="section-subheading text-white/55 mx-auto text-center">
            Every layer of the data value chain, connected and orchestrated by Edos Centre.
          </p>
        </motion.div>

        {/* Pipeline — mobile: vertical, desktop: 3+3 grid with connecting arrows */}
        <div className="max-w-4xl mx-auto">
          {/* Mobile: single column */}
          <div className="flex flex-col items-center lg:hidden">
            {PIPELINE.map((step, i) => (
              <PipelineStep key={step.id} step={step} index={i} isLast={i === PIPELINE.length - 1} />
            ))}
          </div>

          {/* Desktop: two-row grid */}
          <div className="hidden lg:block">
            {/* Top row */}
            <div className="grid grid-cols-3 gap-6 mb-4">
              {PIPELINE.slice(0, 3).map((step, i) => (
                <div key={step.id} className="relative">
                  <PipelineStep step={step} index={i} isLast={false} />
                  {/* Horizontal connection */}
                  {i < 2 && (
                    <div className="absolute top-1/3 -right-3 flex items-center">
                      <div className="w-6 h-px bg-brand-red/40" />
                      <div className="border-t-2 border-r-2 border-brand-red/40 w-2 h-2 -ml-px rotate-45" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Down arrow */}
            <div className="flex justify-center my-2">
              <ArrowDownToLine className="w-6 h-6 text-brand-red/50" />
            </div>

            {/* Bottom row (reversed) */}
            <div className="grid grid-cols-3 gap-6 mt-4">
              {PIPELINE.slice(3).map((step, i) => (
                <div key={step.id} className="relative">
                  <PipelineStep step={step} index={i + 3} isLast={i === 2} />
                  {/* Horizontal connection (reversed) */}
                  {i < 2 && (
                    <div className="absolute top-1/3 -right-3 flex items-center">
                      <div className="w-6 h-px bg-brand-red/40" />
                      <div className="border-t-2 border-r-2 border-brand-red/40 w-2 h-2 -ml-px rotate-45" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
