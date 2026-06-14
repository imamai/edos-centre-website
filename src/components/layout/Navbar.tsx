"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  {
    label: "Solutions",
    href: "/services",
    children: [
      { label: "Data Analytics",      href: "/services/data-analytics",      desc: "BI, dashboards & advanced analytics" },
      { label: "Data Engineering",    href: "/services/data-engineering",    desc: "ETL pipelines, lakes & warehouses" },
      { label: "SaaS Platforms",      href: "/services/saas-platforms",      desc: "Multi-tenant cloud applications" },
      { label: "Web Development",     href: "/services/web-development",     desc: "Enterprise web applications" },
      { label: "Mobile Applications", href: "/services/mobile-applications", desc: "iOS, Android & cross-platform" },
      { label: "M&E Systems",         href: "/services/monitoring-evaluation", desc: "DHIS2, KoboToolbox & reporting" },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "Healthcare",         href: "/industries/healthcare",         desc: "HMIS, EMR & health informatics" },
      { label: "NGOs & Development", href: "/industries/ngos",              desc: "M&E, reporting & program management" },
      { label: "Government",         href: "/industries/government",         desc: "County dashboards & e-services" },
      { label: "Education",          href: "/industries/education",          desc: "School management & analytics" },
      { label: "Agriculture",        href: "/industries/agriculture",        desc: "Crop monitoring & value-chain data" },
    ],
  },
  { label: "Case Studies", href: "/case-studies" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Blog",          href: "/blog",       desc: "Insights & thought leadership" },
      { label: "Guides",        href: "/resources?type=guide",       desc: "How-to guides & best practices" },
      { label: "Whitepapers",   href: "/resources?type=whitepaper",  desc: "In-depth research & reports" },
      { label: "Case Studies",  href: "/case-studies",               desc: "Real-world project outcomes" },
    ],
  },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setActiveMenu(null); }, [pathname]);

  const isHome = pathname === "/";
  const isDark = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/60"
          : isDark
          ? "bg-transparent"
          : "bg-white border-b border-gray-100",
      )}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <EdosLogo dark={!isDark} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                    isDark
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-gray-600 hover:text-brand-purple hover:bg-brand-muted",
                    pathname.startsWith(item.href) && item.href !== "/"
                      ? isDark ? "text-white" : "text-brand-purple"
                      : "",
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                </Link>

                {/* Dropdown */}
                {item.children && (
                  <AnimatePresence>
                    {activeMenu === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-1 w-72 bg-white rounded-2xl shadow-enterprise border border-gray-100 overflow-hidden"
                      >
                        <div className="p-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-muted group transition-colors"
                            >
                              <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-brand-red shrink-0 mt-2" />
                              <div>
                                <p className="text-sm font-medium text-brand-navy group-hover:text-brand-red transition-colors">
                                  {child.label}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{child.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact"
              className={cn(
                "text-sm font-medium px-4 py-2 rounded-lg transition-colors",
                isDark ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-brand-purple",
              )}
            >
              Contact
            </Link>
            <Link href="/consultation" className="btn-primary text-sm !px-5 !py-2.5">
              Book Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              isDark ? "text-white hover:bg-white/10" : "text-brand-navy hover:bg-brand-muted",
            )}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="section-container py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2.5 rounded-xl text-sm font-medium text-brand-navy hover:bg-brand-muted hover:text-brand-red transition-colors"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-brand-red hover:bg-brand-muted transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100">
                <Link href="/consultation" className="btn-primary w-full justify-center">
                  Book Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function EdosLogo({ dark }: { dark: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {/* Icon mark – simplified C+ shape from logo */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="#E31E24" />
        <path
          d="M21 10.5C19.5 9 17.5 8 15 8C10.6 8 7 11.6 7 16C7 20.4 10.6 24 15 24C17.5 24 19.5 23 21 21.5"
          stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"
        />
        <path d="M22 13H25M23.5 11.5V14.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div>
        <div className={cn("font-display font-bold text-base leading-none tracking-tight", dark ? "text-brand-navy" : "text-white")}>
          <span className={dark ? "text-brand-purple" : "text-white"}>edos</span>
          <span className="text-brand-red"> centre</span>
        </div>
        <div className={cn("text-[9px] uppercase tracking-widest leading-none mt-0.5", dark ? "text-gray-400" : "text-white/60")}>
          Embrace Data
        </div>
      </div>
    </div>
  );
}
