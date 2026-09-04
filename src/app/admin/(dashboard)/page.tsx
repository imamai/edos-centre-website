import Link from "next/link";
import { CheckCircle2, AlertTriangle, ShieldAlert, Globe2 } from "lucide-react";
import { getDashboardStats, getRecentAuditLogs, getBillingStats } from "@/lib/admin/queries";
import { StatCard, Card, CardHeader, CardBody } from "@/components/admin/ui/Card";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard — EDOS Control Centre" };

function money(currency: string, value: number) {
  return `${currency} ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default async function AdminDashboardPage() {
  const [stats, recentActivity, billing] = await Promise.all([getDashboardStats(), getRecentAuditLogs(8), getBillingStats()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">EDOS Control Centre</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of the websites and systems you manage.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Websites" value={stats.totalWebsites} />
        <StatCard label="Active Websites" value={stats.activeWebsites} />
        <StatCard label="New Form Submissions" value={stats.newFormSubmissions} hint="Contact + consultation" />
        <StatCard label="Newsletter Subscribers" value={stats.newsletterSubscribers} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Monthly Recurring Revenue" value={money("KES", billing.mrr)} />
        <StatCard label="Outstanding" value={money("KES", billing.outstanding)} hint="Unpaid invoices" />
        <StatCard label="Revenue This Month" value={money("KES", billing.revenueThisMonth)} />
        <StatCard label="Annual Run Rate" value={money("KES", billing.arr)} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="flex items-center justify-between">
            <h2 className="font-medium text-slate-900">Needs Attention</h2>
          </CardHeader>
          <CardBody className={stats.websitesNeedingAttention.length ? "p-0" : undefined}>
            {stats.websitesNeedingAttention.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-slate-400">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                <p>Nothing needs attention right now.</p>
                <p className="text-xs text-slate-300">Websites, domains and SSL certificates are all healthy.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {stats.websitesNeedingAttention.map((item) => (
                  <li key={`${item.type}-${item.id}`} className="px-5 py-3">
                    <Link href={item.href} className="flex items-center justify-between hover:opacity-80">
                      <div className="flex items-center gap-2">
                        {item.type === "website" ? (
                          <Globe2 className="h-4 w-4 text-amber-500" />
                        ) : (
                          <ShieldAlert className={`h-4 w-4 ${item.expired ? "text-red-500" : "text-amber-500"}`} />
                        )}
                        <span className="font-medium text-slate-800">{item.label}</span>
                      </div>
                      <AlertTriangle className={`h-4 w-4 ${"expired" in item && item.expired ? "text-red-500" : "text-amber-500"}`} />
                    </Link>
                    {item.detail && <p className="mt-1 pl-6 text-xs text-slate-400">{item.detail}</p>}
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="font-medium text-slate-900">Recent Activity</h2>
          </CardHeader>
          <CardBody className="p-0">
            {recentActivity.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-400">No activity recorded yet.</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentActivity.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between px-5 py-3 text-sm">
                    <div>
                      <span className="font-medium text-slate-700">
                        {entry.edoscentreadmin_admin_users?.full_name ?? entry.edoscentreadmin_admin_users?.email ?? "System"}
                      </span>
                      <span className="text-slate-400"> — {entry.action.replace(/_/g, " ")}</span>
                    </div>
                    <span className="whitespace-nowrap text-xs text-slate-400">{formatDate(entry.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
