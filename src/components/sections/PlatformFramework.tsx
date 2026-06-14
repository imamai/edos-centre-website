"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Cpu, BarChart3, Globe, Brain, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const LAYERS = [
  {
    num: 1,
    name: "Data Collection",
    subtitle: "Capture at the source",
    color: "#6B5B95",
    icon: Database,
    description: "Digitize and standardize data collection across all touchpoints using industry-leading tools.",
    tools: ["ODK Collect", "KoboToolbox", "SurveyCTO", "REDCap", "CommCare"],
    example: "A county health program collects patient data from 200+ facilities with zero paper forms.",
  },
  {
    num: 2,
    name: "Data Engineering",
    subtitle: "Build the data backbone",
    color: "#E31E24",
    icon: Cpu,
    description: "Transform raw data into reliable, queryable assets with robust ETL pipelines and modern warehousing.",
    tools: ["Apache Airflow", "dbt", "PostgreSQL", "BigQuery", "Data Lakes"],
    example: "500M+ health records processed monthly with 99.9% pipeline reliability.",
  },
  {
    num: 3,
    name: "Analytics & BI",
    subtitle: "Surface what matters",
    color: "#E31E24",
    icon: BarChart3,
    description: "Convert data assets into actionable intelligence with world-class analytics and business intelligence platforms.",
    tools: ["Power BI", "Apache Superset", "Tableau", "Metabase", "Custom BI"],
    example: "NGO programme director views real-time M&E dashboards from any device.",
  },
  {
    num: 4,
    name: "Applications",
    subtitle: "Software that scales",
    color: "#2E234F",
    icon: Globe,
    description: "Build purpose-fit web, mobile, and SaaS applications on top of your data infrastructure.",
    tools: ["Next.js", "React Native", "Flutter", "Django", "FastAPI"],
    example: "Agricultural SaaS platform manages 15,000 farmers across 3 counties.",
  },
  {
    num: 5,
    name: "Decision Support",
    subtitle: "From insight to action",
    color: "#2E234F",
    icon: Brain,
    description: "Empower leadership with AI-enabled reporting, strategic dashboards, and automated insight delivery.",
    tools: ["AI Reports", "KPI Scorecards", "Executive Dashboards", "Alerts & Triggers"],
    example: "Ministry cabinet receives weekly AI-generated performance briefs automatically.",
  },
];

export default function PlatformFramework() {
  const [active, setActive] = useState(0);
  const layer = LAYERS[active];

  return (
    <section className="py-24 bg-brand-navy relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute right-0 top-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl" />

      <div className="section-container relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-eyebrow justify-center text-brand-red">
            <span className="w-4 h-px bg-brand-red" />
            The Edos Framework
            <span className="w-4 h-px bg-brand-red" />
          </div>
          <h2 className="section-heading text-white mb-4">
            One Framework. Every Digital Challenge.
          </h2>
          <p className="section-subheading text-white/55 mx-auto text-center">
            Our 5-layer Digital Transformation Framework unifies collection, engineering,
            analytics, applications, and intelligence into a single coherent story.
          </p>
        </div>

        {/* Main interactive layout */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* Layer selector (vertical pills) */}
          <div className="lg:col-span-2 flex lg:flex-col gap-2">
            {LAYERS.map((l, i) => {
              const isActive = i === active;
              return (
                <button
                  key={l.num}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 border w-full",
                    isActive
                      ? "bg-white/8 border-brand-red/40"
                      : "border-white/5 hover:bg-white/5 hover:border-white/15",
                  )}
                >
                  {/* Layer number */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold transition-colors",
                      isActive ? "bg-brand-red text-white" : "bg-white/8 text-white/40 group-hover:bg-white/12",
                    )}
                  >
                    {l.num}
                  </div>
                  <div className="min-w-0">
                    <div className={cn("font-semibold text-sm transition-colors", isActive ? "text-white" : "text-white/60 group-hover:text-white/80")}>
                      {l.name}
                    </div>
                    <div className="text-xs text-white/35 mt-0.5 truncate">{l.subtitle}</div>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 ml-auto shrink-0 transition-all", isActive ? "text-brand-red" : "text-white/20 group-hover:text-white/40")} />
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-3xl border border-white/10 bg-white/4 backdrop-blur-sm p-8 h-full"
              >
                {/* Layer header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${layer.color}25` }}>
                    <layer.icon className="w-7 h-7" style={{ color: layer.color }} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: layer.color }}>
                      Layer {layer.num}
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white">{layer.name}</h3>
                    <p className="text-white/50 text-sm mt-1">{layer.subtitle}</p>
                  </div>
                </div>

                <p className="text-white/70 leading-relaxed mb-8">{layer.description}</p>

                {/* Tools */}
                <div className="mb-8">
                  <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">Technologies</div>
                  <div className="flex flex-wrap gap-2">
                    {layer.tools.map((t) => (
                      <span key={t} className="badge-dark text-xs">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Example */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/8">
                  <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">Real-world example</div>
                  <p className="text-white/80 text-sm leading-relaxed">{layer.example}</p>
                </div>

                {/* Progress dots */}
                <div className="flex gap-1.5 mt-6">
                  {LAYERS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        i === active ? "w-6 bg-brand-red" : "w-1.5 bg-white/20 hover:bg-white/40",
                      )}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Flow arrows between layers (decorative, desktop) */}
        <div className="hidden lg:flex justify-center mt-12 gap-4 items-center text-white/20 text-xs font-medium">
          {LAYERS.map((l, i) => (
            <div key={l.num} className="flex items-center gap-4">
              <span className={cn("px-3 py-1 rounded-full border text-xs transition-colors", i === active ? "border-brand-red/40 text-brand-red" : "border-white/10 text-white/30")}>
                {l.name}
              </span>
              {i < LAYERS.length - 1 && (
                <ChevronRight className="w-4 h-4 text-white/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
