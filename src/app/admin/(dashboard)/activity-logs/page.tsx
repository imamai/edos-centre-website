import { getRecentAuditLogs } from "@/lib/admin/queries";
import { Card } from "@/components/admin/ui/Card";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Activity Logs — EDOS Control Centre" };

export default async function ActivityLogsPage() {
  const logs = await getRecentAuditLogs(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Activity Logs</h1>
        <p className="mt-1 text-sm text-slate-500">Administrative actions across the platform.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Administrator</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-slate-400">
                    No activity recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-700">
                      {entry.edoscentreadmin_admin_users?.full_name ?? entry.edoscentreadmin_admin_users?.email ?? "System"}
                    </td>
                    <td className="px-5 py-3 capitalize text-slate-600">{entry.action.replace(/_/g, " ")}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-400">{formatDate(entry.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
