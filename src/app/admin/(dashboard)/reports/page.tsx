import Link from "next/link";
import {
  getRevenueByMonth,
  getLeadsByMonth,
  getLeadsByType,
  getConsultationsByStatus,
  getSubscriptionStatusBreakdown,
  getInvoiceStatusBreakdown,
  getTopBlogPosts,
} from "@/lib/admin/queries";
import { Card, CardHeader, CardBody } from "@/components/admin/ui/Card";
import { BarChart, StatusBreakdown } from "@/components/admin/reports/BarChart";

export const metadata = { title: "Reports — EDOS Control Centre" };

function money(value: number) {
  return `${(value / 1000).toFixed(value >= 1000 ? 0 : 1)}k`;
}

export default async function ReportsPage() {
  const [revenue, leads, leadsByType, consultationsByStatus, subscriptionStatus, invoiceStatus, topPosts] = await Promise.all([
    getRevenueByMonth(12),
    getLeadsByMonth(12),
    getLeadsByType(),
    getConsultationsByStatus(),
    getSubscriptionStatusBreakdown(),
    getInvoiceStatusBreakdown(),
    getTopBlogPosts(8),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Real trends computed from recorded payments, form submissions and content — nothing projected or estimated.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="font-medium text-slate-900">Revenue — last 12 months</h2>
            <p className="text-xs text-slate-400">Sum of completed payments (KES), by month.</p>
          </CardHeader>
          <CardBody>
            <BarChart data={revenue} formatValue={money} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-medium text-slate-900">New leads — last 12 months</h2>
            <p className="text-xs text-slate-400">Contact form submissions + consultation bookings, by month.</p>
          </CardHeader>
          <CardBody>
            <BarChart data={leads} />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <h2 className="font-medium text-slate-900">Contact inquiries by type</h2>
          </CardHeader>
          <CardBody>
            <StatusBreakdown items={leadsByType.items} total={leadsByType.total} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-medium text-slate-900">Consultations by status</h2>
          </CardHeader>
          <CardBody>
            <StatusBreakdown items={consultationsByStatus.items} total={consultationsByStatus.total} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-medium text-slate-900">Subscriptions by status</h2>
          </CardHeader>
          <CardBody>
            <StatusBreakdown items={subscriptionStatus.items} total={subscriptionStatus.total} />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="font-medium text-slate-900">Invoices by status</h2>
            <p className="text-xs text-slate-400">{invoiceStatus.total} invoices totalling KES {invoiceStatus.totalBilled.toLocaleString()}</p>
          </CardHeader>
          <CardBody>
            <StatusBreakdown items={invoiceStatus.items} total={invoiceStatus.total} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-medium text-slate-900">Top blog posts by views</h2>
          </CardHeader>
          <CardBody className="p-0">
            {topPosts.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-400">No published posts with recorded views yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {topPosts.map((post, i) => (
                  <li key={post.id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="w-4 text-xs text-slate-400">{i + 1}</span>
                      <Link href={`/blog/${post.slug}`} target="_blank" className="truncate text-slate-700 hover:underline">
                        {post.title}
                      </Link>
                      {!post.is_published && <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">draft</span>}
                    </div>
                    <span className="shrink-0 font-medium text-slate-900">{post.view_count.toLocaleString()}</span>
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
