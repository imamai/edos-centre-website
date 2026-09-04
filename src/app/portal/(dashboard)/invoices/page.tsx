import { getMyInvoices, getMyPayments } from "@/lib/portal/queries";
import { Card } from "@/components/admin/ui/Card";
import { StatusBadge } from "@/components/admin/ui/Badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Invoices — EDOS Client Portal" };

export default async function PortalInvoicesPage() {
  const [invoices, payments] = await Promise.all([getMyInvoices(), getMyPayments()]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Invoices</h1>
        <p className="mt-1 text-sm text-slate-500">Every invoice raised against your account.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Invoice #</th>
                <th className="px-5 py-3">Website</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Due</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    No invoices yet.
                  </td>
                </tr>
              ) : (
                invoices.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs font-medium text-slate-900">{i.invoice_number}</td>
                    <td className="px-5 py-3 text-slate-500">{i.edoscentreadmin_websites?.name ?? "—"}</td>
                    <td className="px-5 py-3">
                      {i.currency} {Number(i.total).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(i.due_date)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={i.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-medium text-slate-900">Payment history</h2>
        <p className="mt-1 text-sm text-slate-500">Every payment we've recorded against your invoices.</p>
        <Card className="mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Invoice</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Method</th>
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                      No payments recorded yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-mono text-xs">{p.edoscentreadmin_invoices?.invoice_number ?? "—"}</td>
                      <td className="px-5 py-3">
                        {p.currency} {Number(p.amount).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 uppercase text-slate-500">{p.payment_method}</td>
                      <td className="px-5 py-3 text-slate-500">{p.transaction_reference ?? "—"}</td>
                      <td className="px-5 py-3 text-xs text-slate-400">{formatDate(p.payment_date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
