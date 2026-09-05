import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFaqs } from "@/lib/queries";
import { absoluteUrl, faqJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Edos Centre",
  description: "Answers to common questions about Edos Centre's data analytics, data engineering, M&E systems and digital transformation services in Kenya.",
  alternates: { canonical: absoluteUrl("/faq") },
};

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  edoscentre_faq_categories: { id: string; name: string } | null;
};

export default async function FaqPage() {
  const faqs = (await getFaqs()) as unknown as FaqRow[];

  const groups = new Map<string, FaqRow[]>();
  for (const faq of faqs) {
    const category = faq.edoscentre_faq_categories?.name ?? "General";
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category)!.push(faq);
  }

  return (
    <>
      <JsonLd data={faqJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })))} />

      <section className="pt-32 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative text-center">
          <Breadcrumbs items={[{ name: "FAQ", path: "/faq" }]} />
          <div className="section-eyebrow justify-center text-brand-red mb-4">
            <span className="w-4 h-px bg-brand-red" /> FAQ <span className="w-4 h-px bg-brand-red" />
          </div>
          <h1 className="font-display text-display-lg font-bold text-white mb-4">
            Frequently asked questions
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Common questions about how we work, what we deliver and how to get started.
          </p>
        </div>
      </section>

      <section className="py-20 bg-brand-muted">
        <div className="section-container max-w-3xl mx-auto">
          {faqs.length === 0 && (
            <p className="text-center text-gray-500">FAQs are coming soon — in the meantime, feel free to reach out with any questions.</p>
          )}
          <div className="space-y-10">
            {[...groups.entries()].map(([category, items]) => (
              <div key={category}>
                <h2 className="font-display text-xl font-bold text-brand-navy mb-4">{category}</h2>
                <div className="space-y-3">
                  {items.map((faq) => (
                    <details key={faq.id} className="group card-enterprise p-5 open:pb-5">
                      <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-brand-navy">
                        {faq.question}
                        <span className="ml-4 shrink-0 text-brand-red transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                      </summary>
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-4">Still have a question?</p>
            <Link href="/contact" className="btn-primary !px-8 !py-3.5 inline-flex">
              Contact us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
