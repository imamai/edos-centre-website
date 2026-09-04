import { getMySubscriptions, getMyInvoices } from "@/lib/portal/queries";
import { Card, CardHeader, CardBody, StatCard } from "@/components/admin/ui/Card";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard — EDOS Client Portal" };

function money(currency: string, value: number) {
  return `${currency} ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default async function PortalDashboardPage() {
  const [subscriptions, invoices] = await Promise.all([getMySubscriptions(), getMyInvoices()]);

  const outstanding = invoices
    .filter((i) => ["pending", "sent", "overdue", "partially_paid"].includes(i.status))
    .reduce((sum, i) => sum + Number(i.total), 0);
  const currency = invoices[0]?.currency ?? subscriptions[0]?.currency ?? "KES";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">An overview of your websites and account with EDOS Centre.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Outstanding balance" value={money(currency, outstanding)} hint={outstanding > 0 ? "Please settle at your earliest convenience" : undefined} />
        <StatCard label="Active subscriptions" value={subscriptions.filter((s) => s.status === "active").length} />
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-medium text-slate-900">Your websites &amp; subscriptions</h2>
        </CardHeader>
        <CardBody className="p-0">
          {subscriptions.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-400">No subscriptions on file yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {subscriptions.map((s) => (
                <li key={s.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <div className="font-medium text-slate-800">{s.edoscentreadmin_websites?.name ?? "—"}</div>
                    <div className="mt-1 text-xs text-slate-400">
                      {s.edoscentreadmin_subscription_plans?.name ?? "Custom plan"} · {s.billing_cycle} · {s.currency} {Number(s.amount).toLocaleString()}
                      {s.renewal_date && ` · renews ${formatDate(s.renewal_date)}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.edoscentreadmin_websites?.status && <StatusBadge status={s.edoscentreadmin_websites.status} />}
                    <StatusBadge status={s.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
