import type { Metadata } from "next";
import { CheckCircle2, Clock, Calendar, Users } from "lucide-react";
import ConsultationForm from "@/components/forms/ConsultationForm";

export const metadata: Metadata = {
  title: "Book a Free Consultation",
  description: "Schedule a free 45-minute strategy consultation with Edos Centre's data and digital transformation experts.",
};

const WHAT_TO_EXPECT = [
  { icon: Clock,    title: "45-minute session", desc: "Focused strategy conversation — no sales pitch" },
  { icon: Calendar, title: "Flexible scheduling", desc: "Morning, afternoon or flexible — EAT timezone" },
  { icon: Users,    title: "Expert panel", desc: "Meet the lead data engineer or solution architect" },
  { icon: CheckCircle2, title: "Actionable next steps", desc: "Leave with a clear recommendation, not a proposal" },
];

export default function ConsultationPage() {
  return (
    <>
      <section className="pt-32 pb-10 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative text-center">
          <div className="section-eyebrow justify-center text-brand-red mb-4">
            <span className="w-4 h-px bg-brand-red" /> Free Consultation <span className="w-4 h-px bg-brand-red" />
          </div>
          <h1 className="font-display text-display-lg font-bold text-white mb-4">
            Book your strategy session
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            45 minutes with an Edos Centre expert. No commitment. Just clarity.
          </p>
        </div>
      </section>

      <section className="py-20 bg-brand-muted">
        <div className="section-container">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left: What to expect */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-display font-bold text-2xl text-brand-navy mb-6">What to expect</h2>
                <div className="space-y-5">
                  {WHAT_TO_EXPECT.map((w) => {
                    const Icon = w.icon;
                    return (
                      <div key={w.title} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-brand-red" />
                        </div>
                        <div>
                          <div className="font-semibold text-brand-navy">{w.title}</div>
                          <div className="text-sm text-gray-500 mt-0.5">{w.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Testimonial snippet */}
              <div className="p-5 rounded-2xl bg-white border border-gray-100">
                <p className="text-sm text-gray-600 italic leading-relaxed mb-3">
                  &ldquo;The consultation alone gave us a clearer roadmap than 6 months of internal planning.
                  Within 45 minutes we knew exactly what to build first.&rdquo;
                </p>
                <div className="text-xs font-medium text-gray-400">— Programme Manager, International NGO</div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3 card-enterprise p-8">
              <h2 className="font-display font-bold text-2xl text-brand-navy mb-2">Request your session</h2>
              <p className="text-sm text-gray-500 mb-6">We&apos;ll confirm within 24 hours with a calendar link.</p>
              <ConsultationForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
