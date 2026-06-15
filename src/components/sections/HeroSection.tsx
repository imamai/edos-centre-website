"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Database, BarChart3, Globe, Smartphone, Brain, LineChart, Table2 } from "lucide-react";

// ── Ecosystem node definitions ────────────────────────────────────────────────
const NODES = [
  { id: "sources",    label: "Data Sources",   icon: Database,   x: 50,  y: 15,  color: "#6B5B95" },
  { id: "etl",        label: "ETL Pipelines",  icon: Table2,     x: 20,  y: 40,  color: "#E31E24" },
  { id: "analytics",  label: "Analytics",      icon: BarChart3,  x: 80,  y: 40,  color: "#E31E24" },
  { id: "apps",       label: "SaaS Apps",      icon: Globe,      x: 20,  y: 70,  color: "#2E234F" },
  { id: "mobile",     label: "Mobile Apps",    icon: Smartphone, x: 50,  y: 75,  color: "#2E234F" },
  { id: "bi",         label: "Business Intel", icon: LineChart,  x: 80,  y: 70,  color: "#2E234F" },
  { id: "ai",         label: "AI Reporting",   icon: Brain,      x: 50,  y: 50,  color: "#E31E24" },
] as const;

const CONNECTIONS = [
  { from: "sources", to: "etl" },
  { from: "sources", to: "analytics" },
  { from: "sources", to: "ai" },
  { from: "etl",     to: "apps" },
  { from: "etl",     to: "ai" },
  { from: "analytics", to: "bi" },
  { from: "analytics", to: "ai" },
  { from: "ai",      to: "mobile" },
  { from: "ai",      to: "bi" },
  { from: "apps",    to: "mobile" },
] as const;

// ── Animated data particle ───────────────────────────────────────────────────
function DataParticle({ x1, y1, x2, y2, delay }: { x1: number; y1: number; x2: number; y2: number; delay: number }) {
  return (
    <motion.circle
      r={3}
      fill="#E31E24"
      initial={{ cx: `${x1}%`, cy: `${y1}%`, opacity: 0, scale: 0 }}
      animate={{
        cx: [`${x1}%`, `${x2}%`],
        cy: [`${y1}%`, `${y2}%`],
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        repeatDelay: 1.5,
        ease: "easeInOut",
      }}
    />
  );
}

// ── Ecosystem visualisation ───────────────────────────────────────────────────
function EcosystemViz() {
  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div className="relative w-full h-full">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Connection lines */}
        {CONNECTIONS.map(({ from, to }, i) => {
          const a = nodeMap[from];
          const b = nodeMap[to];
          return (
            <g key={`${from}-${to}`}>
              <line
                x1={`${a.x}%`} y1={`${a.y}%`}
                x2={`${b.x}%`} y2={`${b.y}%`}
                stroke="rgba(107,91,149,0.3)"
                strokeWidth="0.3"
                strokeDasharray="1 1"
              />
              <DataParticle
                x1={a.x} y1={a.y}
                x2={b.x} y2={b.y}
                delay={i * 0.35}
              />
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {NODES.map((node, i) => {
        const Icon = node.icon;
        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: "backOut" }}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              className="group cursor-default"
            >
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-xl animate-pulse-glow"
                style={{ background: `${node.color}20`, filter: "blur(8px)" }}
              />
              {/* Card */}
              <div className="relative flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border bg-brand-navy/90 backdrop-blur-sm group-hover:border-brand-red/50 transition-all duration-300"
                style={{ borderColor: `${node.color}40` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${node.color}20` }}>
                  <Icon className="w-4 h-4" style={{ color: node.color }} />
                </div>
                <span className="text-[10px] font-medium text-white/80 whitespace-nowrap">{node.label}</span>
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Central pulse rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-brand-red/20"
            style={{ width: 60 * i, height: 60 * i, top: -(30 * i), left: -(30 * i) }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Trust logos / client bar ──────────────────────────────────────────────────
const TRUSTED_BY = ["Ministry of Health", "USAID", "UNICEF", "County Government", "NGO Alliance", "World Bank"];

// ── Main HeroSection ─────────────────────────────────────────────────────────
export default function HeroSection() {
  const [activeWord, setActiveWord] = useState(0);
  const WORDS = ["Insights", "Impact", "Decisions", "Solutions"];

  useEffect(() => {
    const wordsLen = WORDS.length;
    const t = setInterval(() => setActiveWord((w) => (w + 1) % wordsLen), 2800);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-hero">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-red/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-accent-purple/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Main content */}
      <div className="relative flex-1 flex items-center pt-24 pb-16">
        <div className="section-container w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: text */}
            <div>
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-red/30 bg-brand-red/10 mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                <span className="text-xs font-semibold text-brand-red uppercase tracking-widest">
                  East Africa&apos;s Data & Digital Partner
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                className="font-display text-display-lg lg:text-display-xl font-bold text-white leading-[1.08] text-balance mb-6"
              >
                Embrace Data for{" "}
                <span className="block">
                  Optimum{" "}
                  <span className="relative inline-block">
                    <AnimatedWord words={WORDS} active={activeWord} wordClassName="gradient-text" />
                  </span>
                </span>
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-lg text-white/65 leading-relaxed max-w-lg mb-8 text-pretty"
              >
                Transforming data into insights, software into impact, and digital challenges
                into scalable solutions — for healthcare, government, NGOs & enterprise.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-wrap gap-4 mb-12"
              >
                <Link href="/consultation" className="btn-primary text-base !px-7 !py-3.5">
                  Book Consultation
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/services" className="btn-secondary text-base !px-7 !py-3.5">
                  Explore Solutions
                </Link>
              </motion.div>

              {/* Metrics strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10"
              >
                {[
                  { v: "50+",   l: "Projects Delivered" },
                  { v: "500M+", l: "Records Processed" },
                  { v: "20+",   l: "Organizations" },
                ].map((m) => (
                  <div key={m.l}>
                    <div className="font-display text-2xl font-bold text-white">{m.v}</div>
                    <div className="text-xs text-white/50 mt-0.5">{m.l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: ecosystem viz */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="relative h-[420px] lg:h-[520px]"
            >
              <EcosystemViz />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trusted by bar */}
      <div className="relative border-t border-white/8">
        <div className="section-container py-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/30 shrink-0">
              Trusted by
            </span>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {TRUSTED_BY.map((name) => (
                <span key={name} className="text-sm text-white/35 font-medium whitespace-nowrap">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedWord({ words, active, wordClassName = "" }: { words: string[]; active: number; wordClassName?: string }) {
  return (
    <span className="relative inline-block overflow-hidden" style={{ minWidth: "7ch" }}>
      {words.map((word, i) => (
        <motion.span
          key={word}
          className={`absolute inset-0 ${wordClassName}`}
          initial={false}
          animate={{
            y: i === active ? 0 : i < active ? "-100%" : "100%",
            opacity: i === active ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
      {/* Invisible spacer for width */}
      <span className="invisible">{words.reduce((a, b) => (a.length > b.length ? a : b), "")}</span>
    </span>
  );
}
