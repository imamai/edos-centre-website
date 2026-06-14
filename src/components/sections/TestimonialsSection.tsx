"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Edos Centre transformed how our county tracks health outcomes. We went from waiting 6 weeks for a dashboard to having real-time data in the hands of our health team within 2 months.",
    name: "Dr. James Mwangi",
    title: "County Director of Health",
    org: "County Department of Health",
    rating: 5,
    color: "#E31E24",
  },
  {
    quote: "Their M&E system has been a game-changer. We now generate our donor reports in hours instead of weeks, and the data quality is unmatched. Funders have noticed.",
    name: "Sarah Kamau",
    title: "Programme Manager",
    org: "International Development NGO",
    rating: 5,
    color: "#6B5B95",
  },
  {
    quote: "We evaluated three vendors. Edos Centre was the only team that truly understood East African data infrastructure challenges — connectivity, DHIS2, M-Pesa integration. They delivered everything promised.",
    name: "Felix Ochieng",
    title: "ICT Director",
    org: "Ministry of Agriculture",
    rating: 5,
    color: "#22c55e",
  },
  {
    quote: "The EdosPoa SaaS platform powers our 8 branches. Real-time inventory, M-Pesa integration, and eTIMS compliance — everything in one system. Our accountants love it.",
    name: "Amina Hassan",
    title: "Managing Director",
    org: "Retail Chain, Nairobi",
    rating: 5,
    color: "#06b6d4",
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);

  const t = TESTIMONIALS[active];

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
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <blockquote className="font-display text-xl lg:text-2xl font-medium text-white leading-relaxed mb-8 text-balance">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg" style={{ background: t.color }}>
                  {t.name[0]}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-sm text-white/50">{t.title} · {t.org}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
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
        </div>
      </div>
    </section>
  );
}
