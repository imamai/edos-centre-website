"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Building2, GraduationCap, Leaf, Landmark, ShoppingBag, TrendingUp, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
  {
    slug:       "healthcare",
    icon:       Heart,
    name:       "Healthcare",
    tagline:    "Digitizing Africa's health systems",
    color:      "#E31E24",
    challenges: ["Fragmented patient data across facilities", "Weak supply chain visibility", "Manual reporting delays", "Lack of real-time outbreak tracking"],
    solutions:  ["Integrated HMIS & EMR platforms", "DHIS2 implementation & customization", "Supply chain dashboards", "County health information portals"],
    techs:      ["DHIS2", "REDCap", "Power BI", "ODK", "PostgreSQL"],
    outcomes:   ["90% reduction in paper-based reporting", "Real-time disease surveillance", "Unified patient records across facilities"],
  },
  {
    slug:       "ngos",
    icon:       TrendingUp,
    name:       "NGOs & Development",
    tagline:    "Proof-of-impact for development programs",
    color:      "#6B5B95",
    challenges: ["Donor reporting burden", "Disconnected field data collection", "Weak logframe visibility", "Manual beneficiary tracking"],
    solutions:  ["M&E systems & indicator tracking", "KoboToolbox & SurveyCTO deployment", "Donor reporting dashboards", "Beneficiary management platforms"],
    techs:      ["KoboToolbox", "Power BI", "DHIS2", "Superset", "Django"],
    outcomes:   ["80% faster donor report generation", "Real-time programme indicator tracking", "Centralized beneficiary database"],
  },
  {
    slug:       "government",
    icon:       Landmark,
    name:       "Government",
    tagline:    "Data-driven public service delivery",
    color:      "#2E234F",
    challenges: ["Siloed departmental data", "Limited citizen service access", "Weak budget & expenditure visibility", "Manual tax & revenue collection gaps"],
    solutions:  ["County integrated dashboards", "e-Government portals", "Revenue management systems", "Cross-department data integration"],
    techs:      ["Next.js", "PostgreSQL", "Power BI", "DHIS2", "APIs"],
    outcomes:   ["County executive KPI scorecards", "Citizen self-service portals", "Integrated revenue tracking"],
  },
  {
    slug:       "education",
    icon:       GraduationCap,
    name:       "Education",
    tagline:    "Smart institutions, better outcomes",
    color:      "#6B5B95",
    challenges: ["Manual student & academic records", "No early warning for at-risk learners", "Weak financial tracking in schools", "Limited parent engagement"],
    solutions:  ["School management systems (SMS)", "Learner analytics & performance dashboards", "Fee management & reporting", "Parent communication portals"],
    techs:      ["React", "Django", "PostgreSQL", "Power BI", "SMS APIs"],
    outcomes:   ["Automated fee & exam result systems", "Early identification of at-risk learners", "Paperless school administration"],
  },
  {
    slug:       "agriculture",
    icon:       Leaf,
    name:       "Agriculture",
    tagline:    "Data for food security",
    color:      "#22c55e",
    challenges: ["Smallholder farmer data gaps", "Weak value-chain traceability", "Limited market price access", "Manual crop loss reporting"],
    solutions:  ["Farmer registry & crop tracking apps", "Market price dashboards", "Agri-finance data systems", "Climate & yield analytics"],
    techs:      ["ODK", "Power BI", "React Native", "PostgreSQL", "APIs"],
    outcomes:   ["Digitized farmer registries", "Real-time market linkages", "Subsidized input tracking"],
  },
  {
    slug:       "financial-services",
    icon:       Building2,
    name:       "Financial Services",
    tagline:    "Compliance, analytics & fintech",
    color:      "#f59e0b",
    challenges: ["Manual compliance reporting", "Limited credit analytics", "Fraud detection gaps", "Siloed customer financial data"],
    solutions:  ["Regulatory reporting automation", "Credit scoring dashboards", "Fraud analytics systems", "Customer 360 platforms"],
    techs:      ["Python", "Power BI", "PostgreSQL", "FastAPI", "ML"],
    outcomes:   ["Automated regulatory submissions", "Real-time transaction monitoring", "Data-driven credit decisions"],
  },
  {
    slug:       "retail",
    icon:       ShoppingBag,
    name:       "Retail & Logistics",
    tagline:    "Inventory intelligence & customer analytics",
    color:      "#06b6d4",
    challenges: ["Inventory stockouts & waste", "Weak customer lifetime value insight", "Manual supply chain processes", "Limited omnichannel visibility"],
    solutions:  ["POS & inventory management systems", "Customer analytics & loyalty platforms", "Supply chain dashboards", "E-commerce integrations"],
    techs:      ["Next.js", "PostgreSQL", "Supabase", "M-Pesa", "Power BI"],
    outcomes:   ["30% reduction in stockouts", "Customer loyalty program integration", "Multi-branch inventory visibility"],
  },
];

export default function IndustriesSection() {
  const [active, setActive] = useState(0);
  const ind = INDUSTRIES[active];

  return (
    <section className="py-24 bg-white">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-eyebrow justify-center">Industries</div>
          <h2 className="section-heading text-brand-navy mb-4">
            Deep expertise across every sector
          </h2>
          <p className="section-subheading text-gray-500 mx-auto text-center">
            We understand that healthcare data is not the same as agricultural data.
            Our solutions are built for the specific context of each industry.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Industry selector */}
          <div className="lg:col-span-1 space-y-2">
            {INDUSTRIES.map((ind, i) => {
              const Icon = ind.icon;
              const isActive = i === active;
              return (
                <button
                  key={ind.slug}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 border",
                    isActive
                      ? "bg-brand-muted border-brand-red/25 shadow-sm"
                      : "border-transparent hover:bg-brand-muted",
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                    isActive ? "shadow-sm" : "bg-gray-100 group-hover:bg-gray-200"
                  )} style={isActive ? { background: `${ind.color}15` } : {}}>
                    <Icon className="w-5 h-5 transition-colors" style={{ color: isActive ? ind.color : undefined }} />
                  </div>
                  <div>
                    <div className={cn("font-semibold text-sm transition-colors", isActive ? "text-brand-navy" : "text-gray-600")}>
                      {ind.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{ind.tagline}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border border-gray-100 bg-brand-muted p-8"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${ind.color}15` }}>
                    <ind.icon className="w-7 h-7" style={{ color: ind.color }} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-brand-navy">{ind.name}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">{ind.tagline}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6 mb-8">
                  {/* Challenges */}
                  <IndustryBlock title="Challenges" color="#E31E24" items={ind.challenges} />
                  {/* Solutions */}
                  <IndustryBlock title="Solutions" color={ind.color} items={ind.solutions} />
                  {/* Outcomes */}
                  <IndustryBlock title="Outcomes" color="#22c55e" items={ind.outcomes} />
                </div>

                {/* Tech stack */}
                <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-gray-200">
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mr-2">Tech</span>
                  {ind.techs.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600">{t}</span>
                  ))}
                  <Link
                    href={`/industries/${ind.slug}`}
                    className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:gap-2.5 transition-all"
                  >
                    Full case details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustryBlock({ title, color, items }: { title: string; color: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>{title}</div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
