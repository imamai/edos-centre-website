import Link from "next/link";
import { ArrowRight, Calendar, MessageSquare } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-24 bg-brand-navy relative overflow-hidden">
      {/* Animated glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-red/15 rounded-full blur-[80px] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="section-container relative text-center">
        <div className="max-w-3xl mx-auto">
          <div className="section-eyebrow justify-center text-brand-red mb-6">
            <span className="w-4 h-px bg-brand-red" />
            Ready to transform?
            <span className="w-4 h-px bg-brand-red" />
          </div>

          <h2 className="font-display text-display-lg lg:text-display-xl font-bold text-white mb-6 text-balance">
            Turn your data challenge into a{" "}
            <span className="gradient-text">digital advantage</span>
          </h2>

          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-xl mx-auto text-pretty">
            Whether you need a data pipeline, an M&E system, a SaaS platform, or a county dashboard —
            we start with a free 45-minute strategy consultation.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link href="/consultation" className="btn-primary text-base !px-8 !py-4 shadow-glow-red">
              <Calendar className="w-5 h-5" />
              Book Free Consultation
            </Link>
            <Link href="/contact" className="btn-secondary text-base !px-8 !py-4">
              <MessageSquare className="w-5 h-5" />
              Talk to an expert
            </Link>
          </div>

          {/* Trust markers */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/35">
            {[
              "No commitment required",
              "45-minute strategy session",
              "Response within 24 hours",
              "East Africa time zones",
            ].map((point) => (
              <div key={point} className="flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-brand-red" />
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
