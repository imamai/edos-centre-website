import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, Compass } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getNavigation, getSiteSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Page Not Found | Edos Centre",
  robots: { index: false, follow: true },
};

const POPULAR_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default async function NotFound() {
  const [nav, settings] = await Promise.all([getNavigation(), getSiteSettings()]);

  return (
    <>
      <Navbar nav={nav} />
      <main>
        <section className="pt-40 pb-24 bg-gradient-hero relative overflow-hidden min-h-[70vh] flex items-center">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="section-container relative text-center">
            <div className="font-display text-7xl font-black text-white/20 mb-4">404</div>
            <h1 className="font-display text-display-md font-bold text-white mb-4">
              Page not found
            </h1>
            <p className="text-lg text-white/60 max-w-xl mx-auto mb-10">
              The page you&apos;re looking for doesn&apos;t exist or may have moved. Here are some places to go instead.
            </p>

            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {POPULAR_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-4 py-2 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 text-sm font-medium transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/" className="btn-primary !px-8 !py-3.5">
                <Home className="w-4 h-4" /> Back to homepage
              </Link>
              <Link href="/contact" className="btn-secondary !px-8 !py-3.5">
                <Compass className="w-4 h-4" /> Contact us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer nav={nav} settings={settings} />
    </>
  );
}
