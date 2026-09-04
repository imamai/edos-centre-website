import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getWebsites } from "@/lib/admin/queries";
import { Card } from "@/components/admin/ui/Card";
import { StatusBadge } from "@/components/admin/ui/Badge";

export const metadata = { title: "Websites — EDOS Control Centre" };

export default async function WebsitesPage() {
  const websites = await getWebsites();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Websites</h1>
        <p className="mt-1 text-sm text-slate-500">Every site and digital system managed from this platform.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Website</th>
                <th className="px-5 py-3">Domain</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {websites.map((site) => (
                <tr key={site.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <Link href={`/admin/websites/${site.slug}`} className="font-medium text-slate-900 hover:underline">
                      {site.name}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{site.domain ?? "—"}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={site.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/websites/${site.slug}`} className="inline-flex items-center text-slate-400 hover:text-slate-700">
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
