import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, Mail, StickyNote, Server, Receipt, RefreshCw, Users } from "lucide-react";
import { getWebsiteBySlug } from "@/lib/admin/queries";
import { Card } from "@/components/admin/ui/Card";
import WebsiteStatusControl from "@/components/admin/WebsiteStatusControl";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const website = await getWebsiteBySlug(slug);
  return { title: website ? `${website.name} — EDOS Control Centre` : "Website not found" };
}

const OPERATIONAL_LINKS = [
  { label: "Hosting & Domains", href: "/admin/hosting", icon: Server, desc: "Hosting details, domains and SSL certificates for this site." },
  { label: "Invoices", href: "/admin/invoices", icon: Receipt, desc: "Billing history and payments." },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: RefreshCw, desc: "Active plans and renewal dates." },
  { label: "Clients", href: "/admin/clients", icon: Users, desc: "Client contacts and portal access." },
];

export default async function WebsiteOverviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const website = await getWebsiteBySlug(slug);
  if (!website) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{website.name}</h1>
        {website.domain && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <Globe className="h-3.5 w-3.5" /> {website.domain}
          </p>
        )}
      </div>

      <WebsiteStatusControl website={website} />

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-700">Details</h2>
        <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          {website.primary_admin_email && (
            <div>
              <dt className="flex items-center gap-1.5 text-xs text-slate-400"><Mail className="h-3.5 w-3.5" /> Primary admin</dt>
              <dd className="mt-0.5 text-slate-700">{website.primary_admin_email}</dd>
            </div>
          )}
          {website.notes && (
            <div className="sm:col-span-2">
              <dt className="flex items-center gap-1.5 text-xs text-slate-400"><StickyNote className="h-3.5 w-3.5" /> Notes</dt>
              <dd className="mt-0.5 whitespace-pre-wrap text-slate-700">{website.notes}</dd>
            </div>
          )}
        </dl>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-700">Operational tracking</h2>
        <p className="mt-1 text-sm text-slate-500">
          This site doesn&apos;t have a content-management area here — that&apos;s built per-site, like the EDOS Centre CMS.
          Billing, hosting and client records are shared across all sites and filtered by website in each section below.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {OPERATIONAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 hover:border-[#1A1733]/30 hover:bg-slate-50">
              <l.icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <div>
                <div className="text-sm font-medium text-slate-800">{l.label}</div>
                <div className="text-xs text-slate-500">{l.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <p className="text-xs text-slate-400">
        Suspending or enabling maintenance mode here only updates this platform&apos;s status record. Because {website.name} is hosted
        and served independently of this admin platform, actually blocking visitor traffic requires that site&apos;s own codebase to
        check this status before serving requests — the same integration EDOS Centre&apos;s own site uses on itself. Ask if you&apos;d
        like that wired up for this site too.
      </p>
    </div>
  );
}
