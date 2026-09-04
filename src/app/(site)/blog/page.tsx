import type { Metadata } from "next";
import Link from "next/link";
import { Clock, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog – Insights & Thought Leadership",
  description: "Practical insights on data engineering, M&E systems, analytics, SaaS development and digital transformation in East Africa.",
};

// Static fallback posts — replaced by DB data when available
const STATIC_POSTS = [
  {
    slug:        "health-data-lake-architecture",
    title:       "Building a Health Data Lake for East Africa: Architecture Patterns That Work",
    excerpt:     "How we designed a scalable, HIPAA-aligned data lake for a county health network processing 4M+ records monthly.",
    category:    "Data Engineering",
    categoryColor: "#E31E24",
    author:      "Walter Imamai",
    readTime:    8,
    publishedAt: "2025-06-01",
  },
  {
    slug:        "kobo-vs-google-forms",
    title:       "Why KoboToolbox Beats Google Forms for Serious M&E Practitioners",
    excerpt:     "A practical comparison of data collection tools across validation, skip logic, offline use, and DHIS2 integration.",
    category:    "M&E Systems",
    categoryColor: "#6B5B95",
    author:      "Walter Imamai",
    readTime:    6,
    publishedAt: "2025-05-15",
  },
  {
    slug:        "superset-vs-power-bi",
    title:       "Apache Superset vs Power BI: A No-Nonsense Enterprise Comparison",
    excerpt:     "Cost, performance, embedding, and African connectivity tested against real government deployments.",
    category:    "Analytics",
    categoryColor: "#2E234F",
    author:      "Walter Imamai",
    readTime:    10,
    publishedAt: "2025-04-20",
  },
  {
    slug:        "dhis2-api-guide",
    title:       "DHIS2 REST API: A Practical Integration Guide for Developers",
    excerpt:     "Everything you need to know about authenticating, querying data values, and pushing reports to DHIS2.",
    category:    "DHIS2",
    categoryColor: "#22c55e",
    author:      "Walter Imamai",
    readTime:    12,
    publishedAt: "2025-04-01",
  },
  {
    slug:        "ngo-me-system-checklist",
    title:       "The NGO M&E System Checklist: 15 Questions Before You Build",
    excerpt:     "Avoid the most common M&E system failures with this pre-build checklist from 10 years of implementations.",
    category:    "M&E Systems",
    categoryColor: "#6B5B95",
    author:      "Walter Imamai",
    readTime:    7,
    publishedAt: "2025-03-10",
  },
  {
    slug:        "supabase-multitenant-architecture",
    title:       "Supabase Multi-Tenant Architecture: Lessons from a Production SaaS",
    excerpt:     "How we designed Edos Poa's multi-tenant POS SaaS on Supabase — schema isolation, RLS, and billing.",
    category:    "SaaS Development",
    categoryColor: "#06b6d4",
    author:      "Walter Imamai",
    readTime:    14,
    publishedAt: "2025-02-18",
  },
];

export default async function BlogPage() {
  const posts = STATIC_POSTS;

  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative text-center">
          <div className="section-eyebrow justify-center text-brand-red mb-4">
            <span className="w-4 h-px bg-brand-red" /> Blog <span className="w-4 h-px bg-brand-red" />
          </div>
          <h1 className="font-display text-display-lg font-bold text-white mb-4">
            Insights from the field
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Practical knowledge from teams who have built real data systems, not just demos.
          </p>
        </div>
      </section>

      <section className="py-16 bg-brand-muted">
        <div className="section-container">
          {/* Featured post */}
          <div className="mb-10">
            <Link href={`/blog/${posts[0].slug}`} className="group card-enterprise block p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${posts[0].categoryColor}15`, color: posts[0].categoryColor }}>
                  {posts[0].category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Featured</span>
              </div>
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-brand-navy mb-3 group-hover:text-brand-red transition-colors text-balance">
                {posts[0].title}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5 max-w-3xl">{posts[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{posts[0].author}</span>
                <span>·</span>
                <span>{formatDate(posts[0].publishedAt)}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {posts[0].readTime} min</span>
              </div>
            </Link>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group card-enterprise p-6 block">
                <span className="badge text-xs font-semibold px-2.5 py-1 rounded-full mb-4 inline-flex" style={{ background: `${post.categoryColor}15`, color: post.categoryColor }}>
                  {post.category}
                </span>
                <h2 className="font-display font-bold text-lg text-brand-navy mb-2 group-hover:text-brand-red transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>·</span>
                  <span>{post.readTime} min read</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
