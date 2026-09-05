import type { MetadataRoute } from "next";
import { getServices, getIndustries, getCaseStudies, getBlogPosts } from "@/lib/queries";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [services, industries, caseStudies, blogPosts] = await Promise.all([
    getServices(),
    getIndustries(),
    getCaseStudies({ limit: 1000 }),
    getBlogPosts({ limit: 1000 }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                    lastModified: now, changeFrequency: "weekly",  priority: 1 },
    { url: `${SITE_URL}/services`,      lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/industries`,    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/case-studies`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog`,          lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/resources`,     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faq`,           lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/about`,         lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`,       lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
    { url: `${SITE_URL}/consultation`,  lastModified: now, changeFrequency: "yearly",  priority: 0.7 },
    { url: `${SITE_URL}/privacy`,       lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${SITE_URL}/terms`,         lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url:             `${SITE_URL}/services/${s.slug}`,
    lastModified:    new Date(s.updated_at),
    changeFrequency: "monthly",
    priority:        0.8,
  }));

  const industryPages: MetadataRoute.Sitemap = industries.map((i) => ({
    url:             `${SITE_URL}/industries/${i.slug}`,
    lastModified:    new Date(i.updated_at),
    changeFrequency: "monthly",
    priority:        0.8,
  }));

  const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((c) => ({
    url:             `${SITE_URL}/case-studies/${c.slug}`,
    lastModified:    now,
    changeFrequency: "yearly",
    priority:        0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url:             `${SITE_URL}/blog/${p.slug}`,
    lastModified:    p.published_at ? new Date(p.published_at) : now,
    changeFrequency: "yearly",
    priority:        0.6,
  }));

  return [
    ...staticPages,
    ...servicePages,
    ...industryPages,
    ...caseStudyPages,
    ...blogPages,
  ];
}
