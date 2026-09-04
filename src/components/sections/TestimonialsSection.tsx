"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Database } from "@/types/database.types";

type Testimonial = Database["public"]["Tables"]["edoscentre_testimonials"]["Row"];

const COLORS = ["#E31E24", "#6B5B95", "#22c55e", "#06b6d4", "#f59e0b", "#2E234F"];

export default function TestimonialsSection({ testimonials: TESTIMONIALS }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (TESTIMONIALS.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, [TESTIMONIALS.length]);

  const t = TESTIMONIALS[active];
  if (!t) return null;
  const color = COLORS[active % COLORS.length];

  return (
    <section className="py-24 bg-brand-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />

      <div className="section-container relative">
        <div className="text-center mb-12">
          <div className="section-eyebrow justify-center text-brand-red">
            <span className="w-4 h-px bg-brand-red" />
            Client Testimonials
            <span className="w-4 h-px bg-brand-red" />
          </div>
          <h2 className="section-heading text-white">
            What our clients say
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              {/* Quote icon */}
              <Quote className="w-12 h-12 text-brand-red/30 mx-auto mb-6" />

              {/* Stars */}
              {t.rating && (
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              )}

              <blockquote className="font-display text-xl lg:text-2xl font-medium text-white leading-relaxed mb-8 text-balance">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg" style={{ background: color }}>
                  {t.client_name[0]}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">{t.client_name}</div>
                  <div className="text-sm text-white/50">{[t.client_title, t.client_org].filter(Boolean).join(" · ")}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {TESTIMONIALS.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: i === active ? 24 : 6,
                      background: i === active ? "#E31E24" : "rgba(255,255,255,0.2)",
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => setActive((a) => (a + 1) % TESTIMONIALS.length)}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
