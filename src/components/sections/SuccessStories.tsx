"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon, getCaseStudyAccent } from "@/lib/icon-map";
import type { CaseStudyData } from "@/lib/queries";

export default function SuccessStories({ caseStudies: CASES }: { caseStudies: CaseStudyData[] }) {
  const [active, setActive] = useState(0);
  const cs = CASES[active];
  if (!cs) return null;

  const color = getCaseStudyAccent(cs.slug);
  const Icon = getIcon(cs.industry?.icon);

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
            const TabIcon = getIcon(c.industry?.icon);
            const tabColor = getCaseStudyAccent(c.slug);
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
                <TabIcon className="w-4 h-4" style={{ color: i === active ? tabColor : undefined }} />
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
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-1 text-gray-400">{cs.client_name}</div>
                  <h3 className="font-display text-xl font-bold text-brand-navy">{cs.title}</h3>
                  {cs.tagline && <p className="text-sm text-brand-red font-medium mt-1">{cs.tagline}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">Challenge</div>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-6">{cs.challenge}</p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Solution</div>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-6">{cs.solution}</p>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Impact</div>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-6">{cs.impact}</p>
                </div>
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 pt-5 border-t border-gray-100">
                {cs.technologies.map((t) => (
                  <span key={t.id} className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">{t.name}</span>
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
                    <div key={kpi.id} className="text-center p-3 rounded-2xl bg-brand-muted">
                      <div className="font-display text-2xl font-bold text-brand-navy" style={{ color }}>{kpi.metric_value}{kpi.metric_unit ?? ""}</div>
                      <div className="text-xs text-gray-500 mt-1 leading-tight">{kpi.metric_label}</div>
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
