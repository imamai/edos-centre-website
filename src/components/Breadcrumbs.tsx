import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail plus its matching BreadcrumbList JSON-LD — the two must
 * always describe the same path, so they're emitted together from one component. */
export default function Breadcrumbs({ items, dark = true }: { items: Crumb[]; dark?: boolean }) {
  const allItems: Crumb[] = [{ name: "Home", path: "/" }, ...items];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(allItems)} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className={`flex flex-wrap items-center gap-1.5 text-sm ${dark ? "text-white/50" : "text-gray-500"}`}>
          {allItems.map((item, i) => {
            const isLast = i === allItems.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                {isLast ? (
                  <span className={dark ? "text-white" : "text-brand-navy"} aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className={dark ? "hover:text-white transition-colors" : "hover:text-brand-red transition-colors"}>
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
