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
              <a href="https://wa.me/254721201287" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-brand-red shrink-0 fill-current" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
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

