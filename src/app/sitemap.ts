import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edoscentre.com";

const SERVICE_SLUGS = [
  "data-analytics",
  "data-engineering",
  "saas-platforms",
  "dashboard-development",
  "web-development",
  "mobile-applications",
  "desktop-systems",
  "questionnaire-digitization",
  "monitoring-evaluation",
  "dhis2-integrations",
];

const INDUSTRY_SLUGS = [
  "healthcare",
  "ngos",
  "government",
  "education",
  "agriculture",
  "financial-services",
  "retail",
];

const CASE_STUDY_SLUGS = [
  "county-health-information-system",
  "ngo-me-platform",
  "agricultural-reporting-system",
  "school-management-system",
  "enterprise-saas-platform",
  "county-analytics-dashboard",
];

const BLOG_SLUGS = [
  "health-data-lake-architecture",
  "kobo-vs-google-forms",
  "superset-vs-power-bi",
  "dhis2-api-guide",
  "ngo-me-system-checklist",
  "supabase-multitenant-architecture",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                    lastModified: now, changeFrequency: "weekly",  priority: 1 },
    { url: `${BASE_URL}/services`,      lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/industries`,    lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/case-studies`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blog`,          lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/resources`,     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`,         lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`,       lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
    { url: `${BASE_URL}/consultation`,  lastModified: now, changeFrequency: "yearly",  priority: 0.7 },
    { url: `${BASE_URL}/privacy`,       lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE_URL}/terms`,         lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];

  const servicePages: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url:             `${BASE_URL}/services/${slug}`,
    lastModified:    now,
    changeFrequency: "monthly",
    priority:        0.8,
  }));

  const industryPages: MetadataRoute.Sitemap = INDUSTRY_SLUGS.map((slug) => ({
    url:             `${BASE_URL}/industries/${slug}`,
    lastModified:    now,
    changeFrequency: "monthly",
    priority:        0.8,
  }));

  const caseStudyPages: MetadataRoute.Sitemap = CASE_STUDY_SLUGS.map((slug) => ({
    url:             `${BASE_URL}/case-studies/${slug}`,
    lastModified:    now,
    changeFrequency: "yearly",
    priority:        0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url:             `${BASE_URL}/blog/${slug}`,
    lastModified:    now,
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
