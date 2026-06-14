import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Edos Centre",
  description: "Terms and conditions governing use of Edos Centre's website and professional services.",
};

const EFFECTIVE_DATE = "1 January 2025";

export default function TermsPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative">
          <div className="section-eyebrow text-brand-red mb-4">
            <span className="w-4 h-px bg-brand-red" /> Legal
          </div>
          <h1 className="font-display text-display-md font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-white/60">Effective date: {EFFECTIVE_DATE}</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="max-w-3xl space-y-10 text-gray-700">

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">1. Agreement to Terms</h2>
              <p className="leading-relaxed">
                By accessing or using the Edos Centre website (edoscentre.com) or engaging our
                professional services, you agree to be bound by these Terms of Service. If you do
                not agree to these terms, please do not use our website or services.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">2. Website Use</h2>
              <p className="leading-relaxed mb-3">
                You may use this website for lawful purposes only. You agree not to:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Use the website in any way that violates applicable laws or regulations</li>
                <li>Attempt to gain unauthorised access to any part of the website or its infrastructure</li>
                <li>Transmit any unsolicited or unauthorised advertising or promotional material</li>
                <li>Knowingly introduce viruses or other malicious material into the website</li>
                <li>Scrape or extract content without our prior written consent</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">3. Professional Services</h2>
              <p className="leading-relaxed">
                Edos Centre provides data analytics, data engineering, SaaS development and related
                professional services. All service engagements are governed by a separate written
                agreement (Statement of Work, Service Agreement or equivalent) signed by both parties.
                In the event of any conflict between these Terms and a signed service agreement, the
                signed service agreement shall prevail.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">4. Intellectual Property</h2>
              <p className="leading-relaxed">
                All content on this website — including text, graphics, logos, code samples and case
                study descriptions — is the intellectual property of Edos Centre or its licensors
                and is protected by copyright. You may not reproduce, distribute or create derivative
                works from any content without our prior written permission.
              </p>
              <p className="leading-relaxed mt-3">
                Intellectual property rights in deliverables produced under a client engagement are
                governed by the terms of the applicable service agreement.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">5. Disclaimer of Warranties</h2>
              <p className="leading-relaxed">
                This website is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without any
                warranties, express or implied. We do not warrant that the website will be
                uninterrupted, error-free, or free of viruses or other harmful components.
                Technical articles and guides published on this website are provided for informational
                purposes and do not constitute professional advice.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">6. Limitation of Liability</h2>
              <p className="leading-relaxed">
                To the maximum extent permitted by law, Edos Centre shall not be liable for any
                indirect, incidental, special, consequential or punitive damages arising from your
                use of this website or reliance on any content published on it. Our total liability
                to you for any claim arising from use of this website shall not exceed KES 10,000.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">7. Third-Party Links</h2>
              <p className="leading-relaxed">
                This website may contain links to third-party websites. These links are provided for
                convenience only. Edos Centre has no control over the content of those sites and
                accepts no responsibility for them or for any loss or damage that may arise from
                your use of them.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">8. Governing Law</h2>
              <p className="leading-relaxed">
                These Terms are governed by the laws of Kenya. Any disputes arising from these Terms
                or your use of the website shall be subject to the exclusive jurisdiction of the
                courts of Nairobi, Kenya.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">9. Changes to These Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to update these Terms at any time. Material changes will be
                posted on this page with a revised effective date. Continued use of the website
                after changes are posted constitutes acceptance of the revised Terms.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-brand-navy mb-4">10. Contact</h2>
              <p className="leading-relaxed">
                For questions about these Terms, contact us at:{" "}
                <a href="mailto:legal@edoscentre.com" className="text-brand-red hover:underline">
                  legal@edoscentre.com
                </a>
                <br />
                Edos Centre, Nairobi, Kenya.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Link href="/privacy" className="text-brand-red hover:underline text-sm font-medium">
                Read our Privacy Policy →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
