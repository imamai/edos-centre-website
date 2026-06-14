import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Video, BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Static placeholder posts — replaced by DB data in production
const POSTS = [
  {
    category: "Data Engineering",
    color: "#E31E24",
    title: "Building a Health Data Lake for East Africa: Architecture Patterns That Work",
    excerpt: "How we designed a scalable, HIPAA-aligned data lake for a county health network processing 4M+ records monthly.",
    readTime: 8,
    href: "/blog/health-data-lake-architecture",
    type: "blog",
  },
  {
    category: "M&E Systems",
    color: "#6B5B95",
    title: "Why KoboToolbox Beats Google Forms for Serious M&E Practitioners",
    excerpt: "A practical comparison of data collection tools across validation, skip logic, offline use, and DHIS2 integration.",
    readTime: 6,
    href: "/blog/kobo-vs-google-forms",
    type: "blog",
  },
  {
    category: "Dashboard Development",
    color: "#2E234F",
    title: "Apache Superset vs Power BI: A No-Nonsense Enterprise Comparison",
    excerpt: "Cost, performance, embedding, and African connectivity tested against real government deployments.",
    readTime: 10,
    href: "/blog/superset-vs-power-bi",
    type: "blog",
  },
];

const RESOURCES = [
  { icon: FileText, label: "Whitepaper",      href: "/resources?type=whitepaper",      title: "State of Health Informatics in Kenya 2025",     desc: "Comprehensive review of digital health infrastructure." },
  { icon: BookOpen, label: "Guide",           href: "/resources?type=guide",           title: "M&E Systems Setup Guide for NGOs",              desc: "Step-by-step guide to digitizing your programme data." },
  { icon: BarChart3, label: "Industry Report", href: "/resources?type=industry_report", title: "Data Engineering Trends in East Africa 2025",    desc: "Benchmark report across 40+ organizations." },
  { icon: Video,     label: "Webinar",         href: "/resources?type=webinar",         title: "DHIS2 Integration Masterclass",                 desc: "Live walkthrough of DHIS2 API and custom apps." },
];

export default function ThoughtLeadership() {
  return (
    <section className="py-24 bg-brand-muted">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="section-eyebrow">Thought Leadership</div>
            <h2 className="section-heading text-brand-navy">
              Insights from the field
            </h2>
            <p className="section-subheading mt-2">
              Practical knowledge from teams who have built real systems, not just demos.
            </p>
          </div>
          <Link href="/blog" className="btn-outline shrink-0">
            All articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {POSTS.map((post, i) => (
            <Link
              key={post.href}
              href={post.href}
              className={cn(
                "group card-enterprise p-6 block",
                i === 0 ? "lg:col-span-1" : "",
              )}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="badge text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${post.color}15`, color: post.color }}>
                  {post.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                  <Clock className="w-3 h-3" />
                  {post.readTime} min read
                </div>
              </div>
              <h3 className="font-display font-bold text-brand-navy text-lg leading-snug mb-3 group-hover:text-brand-red transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red group-hover:gap-2.5 transition-all">
                Read article <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* Resources strip */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl text-brand-navy">Resources & Guides</h3>
            <Link href="/resources" className="text-sm font-semibold text-brand-red inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
              All resources <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RESOURCES.map((r) => {
              const Icon = r.icon;
              return (
                <Link key={r.href} href={r.href} className="group p-4 rounded-2xl bg-brand-muted hover:bg-white hover:shadow-card border border-transparent hover:border-gray-100 transition-all duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-brand-red" />
                    <span className="text-xs font-semibold text-brand-red uppercase tracking-widest">{r.label}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-brand-navy leading-snug mb-1 group-hover:text-brand-red transition-colors">
                    {r.title}
                  </h4>
                  <p className="text-xs text-gray-500">{r.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
