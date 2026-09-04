import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Edos Centre",
  description: "Edos Centre privacy policy covering data collection, use, storage and your rights under the Kenya Data Protection Act 2019.",
};

const EFFECTIVE_DATE = "1 January 2025";

export default function PrivacyPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative">
          <div className="section-eyebrow text-brand-red mb-4">
            <span className="w-4 h-px bg-brand-red" /> Legal
          </div>
          <h1 className="font-display text-display-md font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/60">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="max-w-3xl prose-custom space-y-10 text-gray-700">

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">1. Who We Are</h2>
              <p className="leading-relaxed">
                Edos Centre (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is a data analytics, data engineering and
                SaaS development company operating in East Africa, headquartered in Nairobi, Kenya.
                This Privacy Policy explains how we collect, use, store and protect personal data
                when you interact with our website, products and services.
              </p>
              <p className="leading-relaxed mt-3">
                We are committed to compliance with the Kenya Data Protection Act 2019 (DPA 2019)
                and applicable international data protection standards.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">2. Data We Collect</h2>
              <p className="leading-relaxed mb-3">We collect the following categories of personal data:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Contact information</strong>: name, email address, phone number, organisation — collected when you submit a contact or consultation form.</li>
                <li><strong>Communication data</strong>: messages, enquiry details and follow-up correspondence.</li>
                <li><strong>Newsletter subscription</strong>: email address and subscription preferences.</li>
                <li><strong>Technical data</strong>: IP address, browser type, pages visited and time on site — collected automatically via server logs and analytics tools.</li>
                <li><strong>Project data</strong>: information you share with us during the course of an engagement — governed separately by our client services agreement.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">3. How We Use Your Data</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>Responding to enquiries and consultation requests</li>
                <li>Delivering services and fulfilling contractual obligations</li>
                <li>Sending newsletters and thought leadership content (with your consent)</li>
                <li>Improving our website and service offerings</li>
                <li>Legal and regulatory compliance</li>
              </ul>
              <p className="leading-relaxed mt-4">
                We do not sell, rent or share your personal data with third parties for marketing
                purposes. We share data only with service providers who process it on our behalf
                (e.g., Supabase for database hosting, Resend for email delivery) and only to the
                extent necessary for service delivery.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">4. Legal Basis for Processing</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Contract</strong>: processing necessary to deliver services you have requested.</li>
                <li><strong>Legitimate interests</strong>: responding to enquiries, improving our services, security monitoring.</li>
                <li><strong>Consent</strong>: newsletter subscriptions and marketing communications.</li>
                <li><strong>Legal obligation</strong>: compliance with applicable laws and regulations.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">5. Data Retention</h2>
              <p className="leading-relaxed">
                We retain contact enquiry data for 3 years from the date of last interaction.
                Newsletter subscriber data is retained until you unsubscribe. Project data
                is retained for the duration specified in our client services agreement.
                Technical/log data is retained for 12 months.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">6. Your Rights</h2>
              <p className="leading-relaxed mb-3">
                Under the Kenya Data Protection Act 2019, you have the right to:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your data (where no legal obligation requires retention)</li>
                <li>Object to processing based on legitimate interests</li>
                <li>Withdraw consent for marketing communications at any time</li>
                <li>Lodge a complaint with the Office of the Data Protection Commissioner (ODPC)</li>
              </ul>
              <p className="leading-relaxed mt-4">
                To exercise these rights, contact us at{" "}
                <a href="mailto:privacy@edoscentre.com" className="text-brand-red hover:underline">
                  privacy@edoscentre.com
                </a>.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">7. Cookies</h2>
              <p className="leading-relaxed">
                Our website uses essential cookies necessary for security and session management.
                We do not use third-party advertising cookies. Analytics data is collected using
                privacy-respecting server-side tooling and does not involve personal data being
                shared with advertising networks.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">8. Security</h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organisational measures to protect your
                personal data — including encryption at rest, access controls, and regular security
                reviews. Our database infrastructure uses Supabase with Row Level Security policies
                and encrypted connections.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">9. Changes to This Policy</h2>
              <p className="leading-relaxed">
                We may update this policy from time to time. Material changes will be communicated
                via email to subscribers and posted on this page with a revised effective date.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">10. Contact</h2>
              <p className="leading-relaxed">
                For privacy enquiries, contact our Data Protection Officer at:{" "}
                <a href="mailto:privacy@edoscentre.com" className="text-brand-red hover:underline">
                  privacy@edoscentre.com
                </a>
                <br />
                Edos Centre, Nairobi, Kenya.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Link href="/terms" className="text-brand-red hover:underline text-sm font-medium">
                Read our Terms of Service →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
