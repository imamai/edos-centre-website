import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Edos Centre. We respond to all inquiries within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-10 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative text-center">
          <div className="section-eyebrow justify-center text-brand-red mb-4">
            <span className="w-4 h-px bg-brand-red" /> Contact <span className="w-4 h-px bg-brand-red" />
          </div>
          <h1 className="font-display text-display-lg font-bold text-white mb-4">
            Let&apos;s talk data
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Every project starts with a conversation. Tell us what you&apos;re trying to solve.
          </p>
        </div>
      </section>

      <section className="py-20 bg-brand-muted">
        <div className="section-container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display font-bold text-2xl text-brand-navy mb-6">Contact information</h2>
                <div className="space-y-4">
                  {[
                    { icon: Mail,           label: "Email",     value: "info@edoscentre.co.ke",  href: "mailto:info@edoscentre.co.ke" },
                    { icon: Phone,          label: "Phone",     value: "+254 721 201 287",        href: "tel:+254721201287" },
                    { icon: MessageCircle,  label: "WhatsApp",  value: "+254 721 201 287",        href: "https://wa.me/254721201287" },
                    { icon: MapPin,         label: "Location",  value: "Nairobi, Kenya",          href: null },
                    { icon: Clock,          label: "Hours",     value: "Mon–Fri, 8am–6pm EAT",   href: null },
                  ].map((c) => {
                    const Icon = c.icon;
                    const content = (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-brand-red" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 font-medium mb-0.5">{c.label}</div>
                          <div className="text-brand-navy font-medium">{c.value}</div>
                        </div>
                      </div>
                    );
                    return c.href
                      ? <a key={c.label} href={c.href} className="block hover:opacity-80 transition-opacity">{content}</a>
                      : <div key={c.label}>{content}</div>;
                  })}
                </div>
              </div>

              {/* Social */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">For quick responses, connect on LinkedIn:</p>
                <a
                  href="https://linkedin.com/company/edoscentre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-purple hover:text-brand-red transition-colors"
                >
                  Edos Centre on LinkedIn →
                </a>
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-2 card-enterprise p-8">
              <h2 className="font-display font-bold text-2xl text-brand-navy mb-6">Send us a message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
