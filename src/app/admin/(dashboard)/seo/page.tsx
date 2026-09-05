import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { getServicesAdmin, getIndustriesAdminFull, getCaseStudiesAdmin, getBlogPostsAdmin } from "@/lib/admin/queries";
import { Card } from "@/components/admin/ui/Card";

export const metadata = { title: "SEO Readiness — EDOS Control Centre" };

type AuditRow = {
  type: string;
  title: string;
  path: string;
  editHref: string;
  seoTitle: string | null;
  seoDescription: string | null;
  isPublished: boolean;
};

export default async function SeoAuditPage() {
  const [services, industries, caseStudies, blogPosts] = await Promise.all([
    getServicesAdmin(),
    getIndustriesAdminFull(),
    getCaseStudiesAdmin(),
    getBlogPostsAdmin(),
  ]);

  const rows: AuditRow[] = [
    ...services.map((s) => ({
      type: "Service",
      title: s.title,
      path: `/services/${s.slug}`,
      editHref: "/admin/websites/edos-centre/services",
      seoTitle: s.seo_title,
      seoDescription: s.seo_description,
      isPublished: s.is_active,
    })),
    ...industries.map((i) => ({
      type: "Industry",
      title: i.name,
      path: `/industries/${i.slug}`,
      editHref: "/admin/websites/edos-centre/industries",
      seoTitle: i.seo_title,
      seoDescription: i.seo_description,
      isPublished: i.is_active,
    })),
    ...caseStudies.map((c) => ({
      type: "Case Study",
      title: c.title,
      path: `/case-studies/${c.slug}`,
      editHref: "/admin/websites/edos-centre/case-studies",
      seoTitle: c.seo_title,
      seoDescription: c.seo_description,
      isPublished: c.is_published,
    })),
    ...blogPosts.map((p) => ({
      type: "Blog Post",
      title: p.title,
      path: `/blog/${p.slug}`,
      editHref: "/admin/websites/edos-centre/blog",
      seoTitle: p.seo_title,
      seoDescription: p.seo_description,
      isPublished: p.is_published,
    })),
  ];

  const published = rows.filter((r) => r.isPublished);
  const missingTitle = published.filter((r) => !r.seoTitle);
  const missingDescription = published.filter((r) => !r.seoDescription);

  const titleCounts = new Map<string, number>();
  for (const r of published) {
    const key = (r.seoTitle || r.title).trim().toLowerCase();
    titleCounts.set(key, (titleCounts.get(key) ?? 0) + 1);
  }
  const duplicateTitleKeys = new Set([...titleCounts.entries()].filter(([, n]) => n > 1).map(([k]) => k));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">SEO Readiness</h1>
        <p className="mt-1 text-sm text-slate-500">
          A checklist of published pages missing a custom SEO title/description, or sharing a duplicate one. This is not
          a ranking score — it just flags gaps you can fill in from each entity&apos;s editor.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="text-sm font-medium text-slate-500">Published pages</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{published.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-medium text-slate-500">Missing SEO title or description</div>
          <div className="mt-2 text-3xl font-semibold text-amber-600">
            {new Set([...missingTitle, ...missingDescription].map((r) => r.path)).size}
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-medium text-slate-500">Duplicate titles</div>
          <div className="mt-2 text-3xl font-semibold text-red-600">{duplicateTitleKeys.size}</div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Page</th>
                <th className="px-5 py-3">SEO Title</th>
                <th className="px-5 py-3">SEO Description</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {published.map((r) => {
                const key = (r.seoTitle || r.title).trim().toLowerCase();
                const isDuplicate = duplicateTitleKeys.has(key);
                const isMissing = !r.seoTitle || !r.seoDescription;
                return (
                  <tr key={r.path} className="hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-500">{r.type}</td>
                    <td className="px-5 py-3">
                      <Link href={r.editHref} className="font-medium text-slate-900 hover:underline">
                        {r.title}
                      </Link>
                      <div className="text-xs text-slate-400">{r.path}</div>
                    </td>
                    <td className="max-w-xs truncate px-5 py-3 text-slate-600">{r.seoTitle || <span className="text-slate-400">using default</span>}</td>
                    <td className="max-w-xs truncate px-5 py-3 text-slate-600">{r.seoDescription || <span className="text-slate-400">using default</span>}</td>
                    <td className="px-5 py-3">
                      {isDuplicate ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                          <AlertTriangle className="h-3.5 w-3.5" /> Duplicate title
                        </span>
                      ) : isMissing ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                          <AlertTriangle className="h-3.5 w-3.5" /> Missing SEO fields
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
