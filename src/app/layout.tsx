import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/queries";
import { organizationJsonLd, websiteJsonLd, SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-inter",
  display:  "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets:  ["latin"],
  variable: "--font-plus-jakarta",
  display:  "swap",
  weight:   ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.site_title || "Edos Centre – Data Analytics, Engineering & Digital Transformation";
  const description =
    settings.site_description ||
    "Edos Centre is East Africa's premier Data Analytics, Data Engineering, SaaS Development and Digital Transformation partner. From data collection to AI-enabled decision support.";
  const ogImage = settings.og_image || "/og-image.png";
  const twitterHandle = settings.twitter_handle || "@edoscentre";

  return {
    title: {
      default:  title,
      template: "%s | Edos Centre",
    },
    description,
    keywords: [
      "data analytics Kenya", "data engineering East Africa", "DHIS2 implementation",
      "M&E systems", "SaaS development Nairobi", "digital transformation Kenya",
      "health informatics", "Power BI consultant Kenya", "ODK KoboToolbox",
      "NGO M&E platform",
    ],
    authors: [{ name: "Edos Centre", url: SITE_URL }],
    creator: "Edos Centre",
    metadataBase: new URL(SITE_URL),
    openGraph: {
      type:        "website",
      locale:      "en_US",
      url:         SITE_URL,
      siteName:    "Edos Centre",
      title,
      description,
      images: [{
        url:    ogImage,
        width:  1200,
        height: 630,
        alt:    title,
      }],
    },
    twitter: {
      card:        "summary_large_image",
      title,
      description,
      images:      [ogImage],
      creator:     twitterHandle,
    },
    robots: {
      index:  true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}

export const viewport: Viewport = {
  themeColor:  "#1A1733",
  colorScheme: "light dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>
        <GoogleAnalytics measurementId={settings.ga_measurement_id} />
        <JsonLd data={organizationJsonLd(settings)} />
        <JsonLd data={websiteJsonLd()} />
        {children}
      </body>
    </html>
  );
}
