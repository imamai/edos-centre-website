import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Sliders, Briefcase, Building2, FileBadge, Newspaper, Users, Quote, HelpCircle, Menu as MenuIcon, Image as ImageIcon, Mail, BarChart3, Layers } from "lucide-react";
import { getWebsiteBySlug } from "@/lib/admin/queries";
import { Card } from "@/components/admin/ui/Card";
import WebsiteStatusControl from "@/components/admin/WebsiteStatusControl";

export const metadata = { title: "EDOS Centre — EDOS Control Centre" };

const SECTIONS: { label: string; href: string; icon: typeof Sliders; ready: boolean }[] = [
  { label: "Site Settings", href: "/admin/websites/edos-centre/site-settings", icon: Sliders, ready: true },
  { label: "Services", href: "/admin/websites/edos-centre/services", icon: Briefcase, ready: true },
  { label: "Industries", href: "/admin/websites/edos-centre/industries", icon: Building2, ready: true },
  { label: "Case Studies", href: "/admin/websites/edos-centre/case-studies", icon: FileBadge, ready: true },
  { label: "Blog", href: "/admin/websites/edos-centre/blog", icon: Newspaper, ready: true },
  { label: "Team", href: "/admin/websites/edos-centre/team", icon: Users, ready: true },
  { label: "Testimonials", href: "/admin/websites/edos-centre/testimonials", icon: Quote, ready: true },
  { label: "FAQs", href: "/admin/websites/edos-centre/faqs", icon: HelpCircle, ready: true },
  { label: "Homepage Metrics", href: "/admin/websites/edos-centre/metrics", icon: BarChart3, ready: true },
  { label: "Platform Framework", href: "/admin/websites/edos-centre/platform-layers", icon: Layers, ready: true },
  { label: "Navigation", href: "/admin/websites/edos-centre/navigation", icon: MenuIcon, ready: true },
  { label: "Media Library", href: "/admin/websites/edos-centre/media", icon: ImageIcon, ready: true },
  { label: "Forms Inbox", href: "/admin/websites/edos-centre/forms", icon: Mail, ready: true },
];

export default async function EdosCentreOverviewPage() {
  const website = await getWebsiteBySlug("edos-centre");
  if (!website) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{website.name}</h1>
        <p className="text-sm text-slate-500">{website.domain}</p>
      </div>

      <WebsiteStatusControl website={website} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.ready ? section.href : "#"} aria-disabled={!section.ready}>
            <Card
              className={`flex items-center justify-between p-5 transition-colors ${
                section.ready ? "hover:border-[#1A1733]/30 hover:bg-slate-50" : "cursor-not-allowed opacity-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <section.icon className="h-5 w-5 text-slate-500" />
                <span className="font-medium text-slate-800">{section.label}</span>
              </div>
              {section.ready ? (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              ) : (
                <span className="text-xs text-slate-400">Coming soon</span>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
