import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

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

export const metadata: Metadata = {
  title: {
    default:  "Edos Centre – Data Analytics, Engineering & Digital Transformation",
    template: "%s | Edos Centre",
  },
  description:
    "Edos Centre is East Africa's premier Data Analytics, Data Engineering, SaaS Development and Digital Transformation partner. From data collection to AI-enabled decision support.",
  keywords: [
    "data analytics Kenya", "data engineering East Africa", "DHIS2 implementation",
    "M&E systems", "SaaS development Nairobi", "digital transformation Kenya",
    "health informatics", "Power BI consultant Kenya", "ODK KoboToolbox",
    "NGO M&E platform",
  ],
  authors: [{ name: "Edos Centre", url: "https://edoscentre.com" }],
  creator: "Edos Centre",
  metadataBase: new URL("https://edoscentre.com"),
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         "https://edoscentre.com",
    siteName:    "Edos Centre",
    title:       "Edos Centre – Embrace Data for Optimum Solutions",
    description: "Transforming data into insights, software into impact, and digital challenges into scalable solutions across East Africa.",
    images: [{
      url:    "/og-image.png",
      width:  1200,
      height: 630,
      alt:    "Edos Centre – Data & Digital Transformation",
    }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Edos Centre – Data & Digital Transformation",
    description: "East Africa's data analytics and digital transformation partner.",
    images:      ["/og-image.png"],
    creator:     "@edoscentre",
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

export const viewport: Viewport = {
  themeColor:  "#1A1733",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
