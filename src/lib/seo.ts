// Centralized SEO helpers: canonical URL base and Schema.org JSON-LD builders.
// SITE_URL falls back to the real production domain so canonical/OG URLs are
// never wrong if NEXT_PUBLIC_SITE_URL isn't set in a given environment — but
// production deploys should still set it explicitly (see .env.example).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://edoscentre.co.ke").replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type SiteSettings = Record<string, string>;

export function organizationJsonLd(settings: SiteSettings) {
  const sameAs = [
    settings.linkedin_url || null,
    settings.twitter_handle ? `https://twitter.com/${settings.twitter_handle.replace(/^@/, "")}` : null,
  ].filter((v): v is string => !!v);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Edos Centre",
    url: SITE_URL,
    logo: absoluteUrl("/EDOS-LOGOty-1.png"),
    ...(settings.site_description ? { description: settings.site_description } : {}),
    ...(settings.contact_email ? { email: settings.contact_email } : {}),
    ...(settings.contact_phone ? { telephone: settings.contact_phone } : {}),
    ...(settings.contact_location
      ? { address: { "@type": "PostalAddress", addressLocality: settings.contact_location, addressCountry: "KE" } }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Edos Centre",
    url: SITE_URL,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceJsonLd({ name, description, path }: { name: string; description?: string | null; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    ...(description ? { description } : {}),
    url: absoluteUrl(path),
    provider: { "@type": "Organization", name: "Edos Centre", url: SITE_URL },
    areaServed: "Kenya",
  };
}

export function articleJsonLd({
  title,
  description,
  authorName,
  publishedAt,
  updatedAt,
  path,
}: {
  title: string;
  description?: string | null;
  authorName?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    ...(description ? { description } : {}),
    ...(authorName ? { author: { "@type": "Person", name: authorName } } : {}),
    publisher: {
      "@type": "Organization",
      name: "Edos Centre",
      logo: { "@type": "ImageObject", url: absoluteUrl("/EDOS-LOGOty-1.png") },
    },
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    dateModified: updatedAt || publishedAt || undefined,
    mainEntityOfPage: absoluteUrl(path),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
