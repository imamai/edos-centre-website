import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

const POSTS = [
  {
    slug:        "health-data-lake-architecture",
    title:       "Building a Health Data Lake for East Africa: Architecture Patterns That Work",
    excerpt:     "How we designed a scalable, HIPAA-aligned data lake for a county health network processing 4M+ records monthly.",
    category:    "Data Engineering",
    categoryColor: "#E31E24",
    author:      "Walter Imamai",
    readTime:    8,
    publishedAt: "2025-06-01",
    content: [
      { type: "p", text: "Health data in East Africa arrives in fragments. DHIS2 pushes aggregate reports weekly. ODK forms dump JSON submissions daily. HMIS databases export CSV files on request. EMR systems sit behind clinic LAN networks with no external access. And spreadsheets — always spreadsheets." },
      { type: "p", text: "When Edos Centre was commissioned to build a county-wide health analytics platform, our first challenge was not dashboards or visualisations. It was answering a deceptively simple question: where does all this data actually live, and how do we build a single trustworthy version of it?" },
      { type: "h2", text: "The Starting Architecture" },
      { type: "p", text: "A health data lake is not a database. It is an organised storage layer that accepts data in any format, preserves raw copies indefinitely, and exposes clean, queryable versions to downstream analytics tools. We designed ours with three zones:" },
      { type: "p", text: "Raw zone — HDFS/S3-compatible object storage (we used MinIO on-premises for data sovereignty reasons). Every file that enters the system lands here untouched. A DHIS2 export from 2019, an ODK submission from this morning, a clinic's exported Excel — all preserved as-is with a timestamp and source identifier." },
      { type: "p", text: "Standardised zone — PostgreSQL tables with a consistent schema. Apache Airflow runs nightly jobs that read from the raw zone, apply cleaning and validation rules, and write to standardised tables. This is where business rules live: reconciling ICD-10 codes, de-duplicating patient records, standardising facility identifiers." },
      { type: "p", text: "Analytics zone — dbt models that transform standardised data into dimensional models optimised for Power BI and Apache Superset. Star schemas, pre-aggregated indicator tables, and time-spine models for period comparisons." },
      { type: "h2", text: "HIPAA Alignment in an East African Context" },
      { type: "p", text: "Kenya's Health Act and the Data Protection Act 2019 impose data residency and security requirements that overlap significantly with HIPAA. We designed with these in mind:" },
      { type: "li", items: [
        "All PHI fields encrypted at rest using PostgreSQL's pgcrypto extension",
        "Row-Level Security (RLS) policies ensuring facility staff can only see their own facility's patient-level records",
        "Audit logs capturing every SELECT on patient tables, stored in a separate append-only audit schema",
        "Network-level isolation: analytics queries run against read replicas with no write access",
        "Automated data retention policies: raw data retained for 10 years per health records legislation",
      ]},
      { type: "h2", text: "The ETL Patterns That Actually Work" },
      { type: "p", text: "After 3 years of health data integration projects, we have converged on a small set of patterns that work reliably in East Africa's infrastructure environment:" },
      { type: "p", text: "DHIS2 → Data Lake: Use the DHIS2 Analytics API rather than the Data Values API for aggregate data. It pre-applies the organisation unit hierarchy and period logic that would otherwise take hours of custom code. Schedule pulls at 2am to avoid peak DHIS2 load." },
      { type: "p", text: "ODK → Data Lake: KoboToolbox and ODK Central both expose REST APIs for form submissions. Pull incrementally by filtering on _submission_time > last_run_timestamp. This avoids re-processing the full submission history every night." },
      { type: "p", text: "Excel → Data Lake: Accept the reality. Many county government systems still produce Excel exports. Build Airflow DAGs that pick up files from a shared folder, validate structure, and ingest. Automate the monitoring rather than trying to eliminate the Excel." },
      { type: "p", text: "Real-time streams: For facilities with stable internet and critical monitoring needs (ICU metrics, disease surveillance), we use PostgreSQL logical replication into Debezium → Kafka → a streaming consumer that writes to the lake." },
      { type: "h2", text: "What We Would Do Differently" },
      { type: "p", text: "If we were starting this project again, we would design the organisation unit hierarchy upfront and enforce it as a controlled vocabulary from day one. Mid-project changes to how counties, sub-counties and facilities are identified cascaded through dozens of tables and cost us two weeks of remediation." },
      { type: "h2", text: "Open Source Stack" },
      { type: "p", text: "Our entire health data lake stack is open source: Apache Airflow (orchestration), PostgreSQL + pgcrypto (warehouse), dbt (transformation), MinIO (object storage), Apache Superset (analytics). The licensing cost is zero. The implementation cost is expertise — which is where Edos Centre comes in." },
    ],
    tags: ["Data Engineering", "Healthcare", "DHIS2", "PostgreSQL", "Apache Airflow", "dbt"],
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
    content: [
      { type: "p", text: "Every few months, a programme officer asks us: \"Can we just use Google Forms?\" The answer is almost always no — and this article explains why KoboToolbox is the professional standard for M&E data collection, and what that practically means for your programme." },
      { type: "h2", text: "The Core Problem with Google Forms" },
      { type: "p", text: "Google Forms is a general-purpose survey tool. It is excellent for event registrations, team feedback, and quick polls. It is not designed for programmatic data collection, and the gaps show immediately when you try to use it for M&E:" },
      { type: "li", items: [
        "No skip logic beyond basic conditional questions",
        "No data validation constraints (you cannot prevent a form submitter from entering '999' as an age)",
        "No offline data collection — requires internet at time of submission",
        "No GPS capture without third-party integration",
        "No cascading select lists (selecting a county does not automatically filter sub-county options)",
        "No DHIS2 integration",
      ]},
      { type: "h2", text: "KoboToolbox: What You Actually Get" },
      { type: "p", text: "KoboToolbox (and its underlying XLSForm standard, which also powers ODK) was designed specifically for field data collection in humanitarian and development contexts. Key capabilities include skip logic, validation constraints, cascading selects, offline-first collection on Android, GPS capture, and media attachments." },
      { type: "p", text: "Skip logic: Multi-condition branching shows or hides questions based on previous answers. If question 3 answer is 'No', skip to question 7. If respondent is female and under 18, show the adolescent section." },
      { type: "p", text: "Validation constraints: XLSForm constraints prevent invalid entries at the point of collection. You can enforce that age is between 0 and 120, require no double spaces in names, or validate phone numbers with regex." },
      { type: "p", text: "Offline-first: KoboCollect on Android stores forms and submissions locally. Submission happens in the background when connectivity is available. Field officers in areas with no data signal work identically to those in Nairobi." },
      { type: "h2", text: "The DHIS2 Integration Argument" },
      { type: "p", text: "If your programme reports to DHIS2 (mandatory for any health programme in Kenya and most NGO programmes with government partnerships), KoboToolbox-to-DHIS2 integration is a solved problem. The Kobo2DHIS connector and custom Python scripts using the DHIS2 REST API can push form submissions directly into DHIS2 data values and tracker events." },
      { type: "p", text: "With Google Forms → DHIS2, you are looking at a custom integration project that requires significant engineering effort, is fragile, and has no community support." },
      { type: "h2", text: "When Google Forms Is Actually Fine" },
      { type: "p", text: "Google Forms is appropriate for internal team surveys, simple registration forms with no complex logic, and non-programmatic feedback collection. The moment you need validated field data, offline collection, GPS, DHIS2 integration, or auditable field officer identification — switch to KoboToolbox. It is free for humanitarian and development organisations." },
    ],
    tags: ["M&E Systems", "KoboToolbox", "ODK", "DHIS2", "Data Collection"],
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
    content: [
      { type: "p", text: "We have deployed both Apache Superset and Power BI in production for government and NGO clients in Kenya. This is a practical comparison based on real projects, not vendor marketing." },
      { type: "h2", text: "Licencing Cost" },
      { type: "p", text: "Power BI: Power BI Pro is $9.99/user/month. Power BI Premium Per User is $20/user/month. For a county dashboard with 200 users, that is $2,000–$4,000/month, paid in USD, permanently. You also need Microsoft 365 tenancy and an Azure subscription for some features." },
      { type: "p", text: "Apache Superset: Open source, self-hosted. The only cost is the server running it — typically $50–$200/month on a cloud VM. For 200 users, the cost difference over 3 years is approximately KES 8–16 million." },
      { type: "h2", text: "Connectivity and Performance" },
      { type: "p", text: "Power BI's service is cloud-only (Microsoft Azure data centres, mostly in Europe/US). Dashboard load times from Kenya vary significantly — we have seen 8–20 second load times for complex dashboards on slow connections." },
      { type: "p", text: "Apache Superset can be deployed on-premises or on a VM in the Safaricom cloud or a local data centre. Dashboard load times from Nairobi against a local server: 1–3 seconds for the same dashboard complexity. For field officers accessing dashboards on mobile data, this difference is material." },
      { type: "h2", text: "Visualisation Capabilities" },
      { type: "p", text: "Power BI wins on out-of-the-box visualisation richness. The default visual library is more polished, and the custom visual marketplace has hundreds of certified visuals. AI-powered features like Q&A (natural language queries) and Smart Narratives are genuinely useful." },
      { type: "p", text: "Superset wins on flexibility. Charts are configured via SQL queries, giving you full control. Advanced users can write any analytical query, including window functions, CTEs and complex joins, and visualise the result. The ECharts integration in recent Superset versions has significantly closed the visual quality gap." },
      { type: "h2", text: "Embedding" },
      { type: "p", text: "If you need to embed dashboards inside an existing web application, Superset's guest token API provides iframe embedding with row-level security per user. Power BI's embedding requires Premium licensing ($20/user) and has more complex authentication flows. We have embedded Superset into 3 government web portals successfully." },
      { type: "h2", text: "Our Recommendation" },
      { type: "p", text: "Power BI: Use it when the client has existing Microsoft 365 licensing, strong connectivity, and business users who need self-service analytics without writing SQL." },
      { type: "p", text: "Apache Superset: Use it when budget is constrained, connectivity is variable, you need to embed dashboards in custom apps, or you have technical users who benefit from SQL-level control." },
    ],
    tags: ["Analytics", "Power BI", "Apache Superset", "Business Intelligence", "Government"],
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
    content: [
      { type: "p", text: "DHIS2's REST API is comprehensive, well-documented, and occasionally maddening. After integrating with DHIS2 deployments across 5 county health departments, here is the practical knowledge we wish we had from day one." },
      { type: "h2", text: "Authentication" },
      { type: "p", text: "DHIS2 supports three authentication methods: Basic auth (username:password base64 encoded) — fine for development, not for production. Personal Access Tokens (PAT) — available in DHIS2 2.38+, generated via My Profile > Personal access tokens and scoped to specific API operations. OAuth2 — for applications where end users authenticate with their own DHIS2 credentials." },
      { type: "p", text: "For a server-to-server integration (e.g., your ETL pipeline pushing data to DHIS2), create a dedicated DHIS2 service account with minimum required permissions, generate a PAT, and use it with the Authorization: ApiToken header." },
      { type: "h2", text: "The Analytics API — for reading aggregate data" },
      { type: "p", text: "The Analytics API is the right choice for 90% of read use cases. It handles the organisation unit hierarchy, period logic and indicator calculations for you. Pass the dx (data element or indicator UIDs), pe (period identifiers such as LAST_12_MONTHS, 2024Q1, 202401), and ou (organisation unit UIDs) dimensions as query parameters." },
      { type: "p", text: "The response is a JSON object with headers, rows, and metaData. Map UIDs to names using metaData.items." },
      { type: "h2", text: "The Data Value Sets API — for writing aggregate data" },
      { type: "p", text: "Use this when pushing aggregate data from an external system into DHIS2. POST to /api/dataValueSets with the dataSet UID, period, orgUnit and an array of dataValues. Always use dryRun: true in your first test call — it validates the payload without writing data." },
      { type: "h2", text: "The Tracker API — for individual-level data" },
      { type: "p", text: "If your DHIS2 deployment uses Tracker programs (case surveillance, patient tracking), use the Tracker API at /api/tracker/trackedEntities. The new Tracker API (DHIS2 2.36+) returns cleaner structures than the legacy trackedEntityInstances endpoint." },
      { type: "h2", text: "Organisation Unit Hierarchies" },
      { type: "p", text: "DHIS2 organisation units have levels (national → county → sub-county → facility) and each unit has a path. When querying the Analytics API, you can reference a specific unit, all level-4 units under a parent (using LEVEL-4), or the authenticated user's assigned org unit (using USER_ORGUNIT). Always cache the org unit tree locally — it changes rarely and fetching it per request is slow." },
      { type: "h2", text: "Period Identifiers" },
      { type: "p", text: "DHIS2 has its own period syntax: 202401 for January 2024 (monthly), 2024Q1 for Q1 2024 (quarterly), 2024 for a full calendar year, and LAST_12_MONTHS as a relative period. When using relative periods, always pass relativePeriodDate to anchor the period to a specific date — otherwise the result changes depending on when the query runs." },
      { type: "h2", text: "Common Errors" },
      { type: "li", items: [
        "409 Conflict on Data Value Set imports: check for category option combo mismatches. The categoryOptionCombo defaults to 'default' but some data sets require explicit combo UIDs.",
        "403 Forbidden on Analytics: the service account user may lack 'View aggregate data' for the specific data set or org unit level.",
        "Slow Analytics queries: check if the analytics tables are up to date via /api/system/info → lastAnalyticsTableSuccess. Out-of-date analytics tables return stale data and run slowly.",
      ]},
    ],
    tags: ["DHIS2", "API Integration", "Healthcare", "Data Engineering", "REST API"],
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
    content: [
      { type: "p", text: "In ten years of building M&E systems for NGOs, we have seen the same failures repeat themselves: a system nobody uses, a dashboard that does not match the logframe, a data collection tool abandoned after month one. Most of these failures were preventable — they stem from starting the technical build before answering a set of fundamental questions." },
      { type: "h2", text: "Programme Design Questions" },
      { type: "p", text: "1. Do you have a finalised logframe or results framework? If not, stop. Build the logframe first. An M&E system is an instrument for measuring logframe indicators. Without a finalized logframe, you will build a system that measures the wrong things." },
      { type: "p", text: "2. Are your indicators SMART? 'Improved health outcomes' is not an indicator. 'Percentage of ANC1 visits completed within the first trimester, measured monthly at health facility level' is an indicator. Each measurable indicator needs a clear numerator, denominator and disaggregation." },
      { type: "p", text: "3. Who owns indicator calculation? Will calculations be automatic (built into the system) or manual (someone computes them in Excel and enters the result)? Manual calculation invites error. Agreement on this before build saves months of argument after." },
      { type: "h2", text: "Data Collection Questions" },
      { type: "p", text: "4. Who are your data collectors? Field officers with smartphones? Clinic nurses at a desktop computer? Community health workers with feature phones? The answer determines your data collection technology." },
      { type: "p", text: "5. What is the internet connectivity like in your programme areas? Test it before you design. 'Low connectivity' in Nairobi means slower 4G. 'Low connectivity' in northern Kenya may mean GPRS or no data at all." },
      { type: "p", text: "6. What data protection requirements apply? Kenya's Data Protection Act 2019 requires a Data Protection Impact Assessment for processing sensitive categories of data including health records, GPS location, and national ID numbers." },
      { type: "p", text: "7. Who validates data quality at the point of collection? Field officers make errors. Forms need validation rules that catch impossible values, logical contradictions and missing required fields." },
      { type: "h2", text: "Reporting Questions" },
      { type: "p", text: "8. What exactly does your donor want to see? Get a copy of your most recent donor report. Every table and figure in that report must map to a field or calculation in your system. If it cannot, your system will not produce the report without manual intervention." },
      { type: "p", text: "9. How often do you need to report at each level? Field officer → supervisor (weekly?), supervisor → programme manager (monthly?), programme manager → donor (quarterly?). Each level may need a different view." },
      { type: "p", text: "10. Do you need real-time visibility or scheduled reports? Real-time requires infrastructure (streaming pipelines, live dashboards). Scheduled reports (daily ETL, email delivery) are cheaper and simpler. For most NGOs, daily refresh is sufficient." },
      { type: "h2", text: "Technical Questions" },
      { type: "p", text: "11. Where will data be stored? Cloud (which cloud? which region? what are the data residency implications?) or on-premises? On-premises reduces connectivity dependency but requires local IT capacity for maintenance." },
      { type: "p", text: "12. What are your data retention requirements? Most donors require programme data to be retained for 5–10 years after project close. Object storage (S3, MinIO) is the right answer for long-term retention at acceptable cost." },
      { type: "p", text: "13. Who maintains the system after go-live? This question kills more M&E systems than any technical failure. If the consultant who built it leaves and the NGO has no internal capacity, you will have an abandoned system within 18 months." },
      { type: "h2", text: "Change Management Questions" },
      { type: "p", text: "14. How will you onboard field officers? Plan for a 2-day training, not a 2-hour overview. Include hands-on practice with real forms, troubleshooting common errors, and a clear escalation path when something goes wrong in the field." },
      { type: "p", text: "15. What is the plan when data looks wrong? Every M&E system eventually produces a number that does not look right. Who investigates? What is the process for identifying whether it is a data quality issue, a calculation error, or a programme reality?" },
    ],
    tags: ["M&E Systems", "NGOs", "KoboToolbox", "DHIS2", "Data Collection", "Best Practices"],
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
    content: [
      { type: "p", text: "EdosPoa is a multi-tenant Point of Sale and business management SaaS that we designed and built on Supabase. With 50+ tenants and 500 million records in production, here is what we learned about multi-tenancy on Supabase." },
      { type: "h2", text: "The Three Multi-Tenancy Models" },
      { type: "p", text: "Schema per tenant: Each tenant gets their own PostgreSQL schema. Strongest isolation, easiest per-tenant backups, but schema management complexity scales with tenant count. Supabase does not natively support schema-per-tenant out of the box." },
      { type: "p", text: "Database per tenant: Maximum isolation — separate Supabase project per tenant. Prohibitively expensive at scale." },
      { type: "p", text: "Shared schema with tenant ID: All tenants share the same tables. Every row has a tenant_id column. Row Level Security (RLS) filters data by tenant. This is what we chose, and it is what Supabase is optimised for." },
      { type: "h2", text: "Row Level Security: The Core Architecture Decision" },
      { type: "p", text: "In a shared-schema multi-tenant database, RLS is not optional — it is the security boundary between tenants. Every table that contains tenant-specific data has an RLS policy using the tenant_id column matched against the authenticated user's tenant membership." },
      { type: "p", text: "The key performance consideration: a subquery to resolve tenant_id from the user's profile runs on every row evaluation. On a table with 10 million rows, this is expensive. We replaced it with a JWT claims approach where the tenant ID is embedded in the access token at login time." },
      { type: "h2", text: "JWT Claims for Tenant Context" },
      { type: "p", text: "We set the tenant ID in the Supabase JWT using a custom app.tenant_id claim via a database hook on auth.sign_in. The hook function resolves the user's tenant from the tenant_members table and embeds it in the token's app_metadata. RLS policies then read from the JWT directly — without a subquery — which is 10–20× faster on large tables." },
      { type: "h2", text: "Schema Design" },
      { type: "p", text: "We ended up with three schemas: public (shared entities — tenants, tenant_members, subscription_plans), app (operational data — sales, products, inventory, customers — all with tenant_id and RLS), and analytics (pre-aggregated reporting tables rebuilt nightly by pg_cron — no RLS needed since data is pre-filtered during aggregation)." },
      { type: "h2", text: "Performance at Scale" },
      { type: "p", text: "By month 8, our largest tenant had 50 million rows in the sale_items table. Query performance degraded noticeably. The fixes: partial indexes on tenant_id + created_at, PgBouncer connection pooling tuned to our p99 concurrency, and analytics pre-aggregation (moving summary calculations from query-time to nightly materialized views)." },
      { type: "h2", text: "Billing Integration" },
      { type: "p", text: "We integrated Stripe for international customers and M-Pesa for Kenya-based businesses. All billing state lives in our database, not in Stripe alone — we sync Stripe webhooks into a billing_events table and re-derive subscription state from events. For M-Pesa, we use the Daraja STK Push API with a callback URL hitting a Supabase Edge Function." },
      { type: "h2", text: "The RLS Gotcha That Cost Us a Week" },
      { type: "p", text: "Supabase's service role key bypasses RLS entirely. Every background job or admin operation that uses the service role key has direct access to all tenant data. Document this clearly in your team — a developer who accidentally uses the service role key in client-side code breaks your entire isolation model." },
      { type: "h2", text: "Would We Use Supabase Again?" },
      { type: "p", text: "Yes, without hesitation. The combination of PostgreSQL, RLS, realtime subscriptions, Edge Functions, and built-in auth handles 90% of what a production SaaS needs. For a team of 2–4 engineers shipping a production SaaS, the productivity gain from Supabase's managed infrastructure is substantial." },
    ],
    tags: ["SaaS Development", "Supabase", "PostgreSQL", "Next.js", "Multi-tenant", "Architecture"],
  },
];

type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "li"; items: string[] };

type Post = typeof POSTS[0];

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — Edos Centre Blog`,
    description: post.excerpt,
  };
}

function PostBody({ content }: { content: Post["content"] }) {
  return (
    <div>
      {(content as ContentBlock[]).map((block, i) => {
        if (block.type === "h2") {
          return (
            <h2 key={i} className="font-display text-2xl font-bold text-brand-navy mt-10 mb-4">
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={i} className="font-display text-lg font-bold text-brand-navy mt-8 mb-3">
              {block.text}
            </h3>
          );
        }
        if (block.type === "li") {
          return (
            <ul key={i} className="list-disc list-inside space-y-2 my-5 text-gray-700">
              {block.items.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-gray-700 leading-relaxed mb-4">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const others = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

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

          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-5"
            style={{ background: `${post.categoryColor}30`, color: post.categoryColor }}
          >
            {post.category}
          </span>

          <h1 className="font-display text-display-sm font-bold text-white mb-6 text-balance leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-sm text-white/50">
            <span className="font-medium text-white/80">{post.author}</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main article */}
            <article className="lg:col-span-3 max-w-2xl">
              <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-brand-red pl-6">
                {post.excerpt}
              </p>
              <PostBody content={post.content} />

              {/* Tags */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-brand-muted border border-gray-200 text-xs font-medium text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Author */}
              <div className="card-enterprise p-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-red/10 flex items-center justify-center mb-4">
                  <span className="font-display font-bold text-xl text-brand-red">WI</span>
                </div>
                <h3 className="font-semibold text-brand-navy mb-1">{post.author}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Founder of Edos Centre. 10+ years building data systems across East Africa.
                </p>
              </div>

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
      <section className="py-16 bg-brand-muted">
        <div className="section-container">
          <h2 className="font-display text-2xl font-bold text-brand-navy mb-8">
            More from the blog
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group card-enterprise p-6 block">
                <span
                  className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold mb-4"
                  style={{ background: `${p.categoryColor}15`, color: p.categoryColor }}
                >
                  {p.category}
                </span>
                <h3 className="font-display font-bold text-lg text-brand-navy mb-2 group-hover:text-brand-red transition-colors leading-snug">
                  {p.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{p.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{formatDate(p.publishedAt)}</span>
                  <span>·</span>
                  <span>{p.readTime} min</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
