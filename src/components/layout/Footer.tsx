import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Twitter, Github } from "lucide-react";
import EdosLogoMark from "@/components/ui/EdosLogoMark";
import NewsletterForm from "./NewsletterForm";

const SOLUTIONS = [
  { label: "Data Analytics",     href: "/services/data-analytics" },
  { label: "Data Engineering",   href: "/services/data-engineering" },
  { label: "SaaS Platforms",     href: "/services/saas-platforms" },
  { label: "Web Development",    href: "/services/web-development" },
  { label: "Mobile Apps",        href: "/services/mobile-applications" },
  { label: "M&E Systems",        href: "/services/monitoring-evaluation" },
  { label: "DHIS2 Integration",  href: "/services/dhis2-integrations" },
  { label: "Dashboard Dev",      href: "/services/dashboard-development" },
];

const INDUSTRIES = [
  { label: "Healthcare",    href: "/industries/healthcare" },
  { label: "NGOs",          href: "/industries/ngos" },
  { label: "Government",    href: "/industries/government" },
  { label: "Education",     href: "/industries/education" },
  { label: "Agriculture",   href: "/industries/agriculture" },
  { label: "Finance",       href: "/industries/financial-services" },
];

const RESOURCES = [
  { label: "Blog",         href: "/blog" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Guides",       href: "/resources?type=guide" },
  { label: "Whitepapers",  href: "/resources?type=whitepaper" },
  { label: "About Us",     href: "/about" },
  { label: "Contact",      href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="section-container py-12">
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div>
              <h3 className="font-display text-xl font-bold">Stay ahead of the data curve</h3>
              <p className="text-white/60 text-sm mt-1">Insights on data engineering, analytics & digital transformation — straight to your inbox.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <EdosLogoMark dark={false} />
            </div>

            <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
              East Africa&apos;s premier Data Analytics, Data Engineering, SaaS Development &
              Digital Transformation partner. Turning data into decisions.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-white/60">
                <MapPin className="w-4 h-4 text-brand-red shrink-0" />
                Nairobi, Kenya — Serving East Africa
              </div>
              <a href="mailto:info@edoscentre.co.ke" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-brand-red shrink-0" />
                info@edoscentre.co.ke
              </a>
              <a href="tel:+254721201287" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-brand-red shrink-0" />
                +254 721 201 287
              </a>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <SocialLink href="https://linkedin.com" icon={<Linkedin className="w-4 h-4" />} />
              <SocialLink href="https://twitter.com"  icon={<Twitter  className="w-4 h-4" />} />
              <SocialLink href="https://github.com"   icon={<Github   className="w-4 h-4" />} />
            </div>
          </div>

          {/* Links */}
          <FooterCol title="Solutions" links={SOLUTIONS} />
          <FooterCol title="Industries" links={INDUSTRIES} />
          <FooterCol title="Company" links={RESOURCES} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Edos Centre. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm uppercase tracking-widest text-white/40 mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all"
    >
      {icon}
    </a>
  );
}

