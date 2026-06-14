"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const METRICS = [
  { value: 50,  suffix: "+", label: "Projects Delivered",     desc: "Across East Africa" },
  { value: 500, suffix: "M+", label: "Records Processed",     desc: "Monthly across all systems" },
  { value: 20,  suffix: "+", label: "Organizations Served",   desc: "Government, NGO & enterprise" },
  { value: 99.9, suffix: "%", label: "System Reliability",    desc: "SLA maintained" },
  { value: 100, suffix: "+", label: "Dashboards Built",       desc: "Live and in production" },
  { value: 7,   suffix: "",  label: "Industry Verticals",     desc: "Deep domain expertise" },
];

function CountUp({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1800;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Number((target * ease).toFixed(target % 1 !== 0 ? 1 : 0)));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [inView, target]);

  return (
    <span>
      {count}{suffix}
    </span>
  );
}

export default function MetricsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-red/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-accent-purple/5 rounded-full blur-3xl" />

      <div className="section-container relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-eyebrow justify-center">By the Numbers</div>
          <h2 className="section-heading text-brand-navy mb-4">
            The scale of our impact
          </h2>
          <p className="section-subheading text-gray-500 mx-auto text-center">
            Numbers that reflect real systems, real data, and real organizational transformation.
          </p>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center p-6 rounded-3xl border border-gray-100 bg-brand-muted hover:border-brand-red/20 hover:shadow-card transition-all duration-300"
            >
              <div className="font-display text-4xl lg:text-5xl font-black text-brand-navy mb-2" style={{ letterSpacing: "-0.03em" }}>
                <CountUp target={m.value} suffix={m.suffix} inView={inView} />
              </div>
              <div className="font-semibold text-sm text-brand-navy mb-1">{m.label}</div>
              <div className="text-xs text-gray-400">{m.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
