import type { Metadata } from "next";
import Link from "next/link";
import { Clock, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getBlogPosts } from "@/lib/queries";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog | Data Engineering, M&E & Analytics Insights",
  description: "Practical insights on data engineering, M&E systems, analytics, SaaS development and digital transformation in East Africa.",
  alternates: { canonical: absoluteUrl("/blog") },
};

export default async function BlogPage() {
  const posts = await getBlogPosts({ limit: 20 });

  if (posts.length === 0) {
    return (
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative text-center">
          <h1 className="font-display text-display-lg font-bold text-white mb-4">Insights from the field</h1>
          <p className="text-white/60">New articles are on the way — check back soon.</p>
        </div>
      </section>
    );
  }

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
                {posts[0].category_name && (
                  <span className="badge text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${posts[0].category_color}15`, color: posts[0].category_color ?? undefined }}>
                    {posts[0].category_name}
                  </span>
                )}
                <span className="text-xs text-gray-400 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Featured</span>
              </div>
              <h2 className="font-display font-bold text-2xl lg:text-3xl text-brand-navy mb-3 group-hover:text-brand-red transition-colors text-balance">
                {posts[0].title}
              </h2>
              {posts[0].excerpt && <p className="text-gray-600 leading-relaxed mb-5 max-w-3xl">{posts[0].excerpt}</p>}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                {posts[0].author_name && <span>{posts[0].author_name}</span>}
                {posts[0].author_name && <span>·</span>}
                {posts[0].published_at && <span>{formatDate(posts[0].published_at)}</span>}
                {posts[0].reading_time_min && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {posts[0].reading_time_min} min</span>
                  </>
                )}
              </div>
            </Link>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group card-enterprise p-6 block">
                {post.category_name && (
                  <span className="badge text-xs font-semibold px-2.5 py-1 rounded-full mb-4 inline-flex" style={{ background: `${post.category_color}15`, color: post.category_color ?? undefined }}>
                    {post.category_name}
                  </span>
                )}
                <h2 className="font-display font-bold text-lg text-brand-navy mb-2 group-hover:text-brand-red transition-colors leading-snug">
                  {post.title}
                </h2>
                {post.excerpt && <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {post.published_at && <span>{formatDate(post.published_at)}</span>}
                  {post.reading_time_min && (
                    <>
                      <span>·</span>
                      <span>{post.reading_time_min} min read</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
