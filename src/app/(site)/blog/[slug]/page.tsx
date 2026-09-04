import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDate } from "@/lib/utils";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/queries";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getBlogPosts({ limit: 100 });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.seo_title || `${post.title} — Edos Centre Blog`,
    description: post.seo_description || post.excerpt || undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const category = post.edoscentre_blog_categories;
  const tags = post.edoscentre_blog_post_tags
    .map((t) => t.edoscentre_blog_tags)
    .filter((t): t is NonNullable<typeof t> => !!t);

  const allPosts = await getBlogPosts({ limit: 20 });
  const others = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="section-container relative max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {category && (
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-5"
              style={{ background: `${category.color_hex}30`, color: category.color_hex }}
            >
              {category.name}
            </span>
          )}

          <h1 className="font-display text-display-sm font-bold text-white mb-6 text-balance leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-sm text-white/50">
            {post.author_name && <span className="font-medium text-white/80">{post.author_name}</span>}
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at)}
              </span>
            )}
            {post.reading_time_min && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.reading_time_min} min read
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main article */}
            <article className="lg:col-span-3 max-w-2xl">
              {post.excerpt && (
                <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-brand-red pl-6">
                  {post.excerpt}
                </p>
              )}
              {post.content && (
                <div className="prose-blog">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: (props) => <h2 className="font-display text-2xl font-bold text-brand-navy mt-10 mb-4" {...props} />,
                      h3: (props) => <h3 className="font-display text-lg font-bold text-brand-navy mt-8 mb-3" {...props} />,
                      p: (props) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
                      ul: (props) => <ul className="list-disc list-inside space-y-2 my-5 text-gray-700" {...props} />,
                      li: (props) => <li className="leading-relaxed" {...props} />,
                      a: (props) => <a className="text-brand-red underline hover:no-underline" {...props} />,
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 rounded-full bg-brand-muted border border-gray-200 text-xs font-medium text-gray-600"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Author */}
              {post.author_name && (
                <div className="card-enterprise p-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-red/10 flex items-center justify-center mb-4">
                    <span className="font-display font-bold text-xl text-brand-red">
                      {post.author_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-brand-navy mb-1">{post.author_name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Founder of Edos Centre. 10+ years building data systems across East Africa.
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="bg-gradient-brand rounded-3xl p-6 text-center">
                <p className="text-white font-semibold mb-3 text-sm leading-snug">
                  Need help with a similar project?
                </p>
                <Link href="/consultation" className="btn-primary !py-2.5 !px-5 text-sm w-full justify-center">
                  Book a call <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* More posts */}
      {others.length > 0 && (
        <section className="py-16 bg-brand-muted">
          <div className="section-container">
            <h2 className="font-display text-2xl font-bold text-brand-navy mb-8">
              More from the blog
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group card-enterprise p-6 block">
                  {p.category_name && (
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold mb-4"
                      style={{ background: `${p.category_color}15`, color: p.category_color ?? undefined }}
                    >
                      {p.category_name}
                    </span>
                  )}
                  <h3 className="font-display font-bold text-lg text-brand-navy mb-2 group-hover:text-brand-red transition-colors leading-snug">
                    {p.title}
                  </h3>
                  {p.excerpt && <p className="text-sm text-gray-500 line-clamp-2 mb-4">{p.excerpt}</p>}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {p.published_at && <span>{formatDate(p.published_at)}</span>}
                    {p.reading_time_min && (
                      <>
                        <span>·</span>
                        <span>{p.reading_time_min} min</span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
