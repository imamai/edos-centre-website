import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

// ── Services ──────────────────────────────────────────────────────────────────
export async function getServices() {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("website")
    .from("services")
    .select(`*, service_capabilities(*), service_technologies(technology_id, technologies(*))`)
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

export async function getServiceBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("website")
    .from("services")
    .select(`*, service_capabilities(*), service_technologies(technology_id, technologies(*))`)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data;
}

// ── Industries ────────────────────────────────────────────────────────────────
export async function getIndustries() {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("website")
    .from("industries")
    .select(`*, industry_challenges(*), industry_solutions(*), industry_outcomes(*), industry_technologies(technology_id, technologies(*))`)
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

export async function getIndustryBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("website")
    .from("industries")
    .select(`*, industry_challenges(*), industry_solutions(*), industry_outcomes(*), industry_technologies(technology_id, technologies(*))`)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data;
}

// ── Case Studies ──────────────────────────────────────────────────────────────
export async function getCaseStudies({ featured = false, limit = 12 } = {}) {
  const supabase = await createClient();
  let q = supabase
    .schema("website")
    .from("case_studies")
    .select(`*, case_study_kpis(*), case_study_technologies(technology_id, technologies(*)), industries(id, name, slug, icon)`)
    .eq("is_published", true)
    .order("sort_order")
    .limit(limit);
  if (featured) q = q.eq("is_featured", true);
  const { data } = await q;
  return data ?? [];
}

export async function getCaseStudyBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("website")
    .from("case_studies")
    .select(`*, case_study_kpis(*), case_study_technologies(technology_id, technologies(*)), industries(id, name, slug)`)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

// ── Blog ──────────────────────────────────────────────────────────────────────
export async function getBlogPosts({ limit = 9, categorySlug }: { limit?: number; categorySlug?: string } = {}) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = supabase
    .schema("website")
    .from("v_blog_posts_published")
    .select("*")
    .limit(limit);
  if (categorySlug) q = q.eq("category_slug", categorySlug);
  const { data } = await q;
  return (data ?? []) as Database["website"]["Views"]["v_blog_posts_published"]["Row"][];
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("website")
    .from("blog_posts")
    .select(`*, blog_categories(*), blog_post_tags(blog_tags(*))`)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

export async function getFeaturedBlogPosts(limit = 3) {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("website")
    .from("v_blog_posts_published")
    .select("*")
    .eq("is_featured" as never, true)
    .limit(limit);
  return data ?? [];
}

// ── Metrics ───────────────────────────────────────────────────────────────────
export async function getMetrics() {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("website")
    .from("metrics")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

// ── Team ──────────────────────────────────────────────────────────────────────
export async function getTeamMembers({ leadershipOnly = false } = {}) {
  const supabase = await createClient();
  let q = supabase
    .schema("website")
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (leadershipOnly) q = q.eq("is_leadership", true);
  const { data } = await q;
  return data ?? [];
}

// ── Testimonials ──────────────────────────────────────────────────────────────
export async function getTestimonials({ featured = false } = {}) {
  const supabase = await createClient();
  let q = supabase
    .schema("website")
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (featured) q = q.eq("is_featured", true);
  const { data } = await q;
  return data ?? [];
}

// ── Platform Layers ───────────────────────────────────────────────────────────
export async function getPlatformLayers() {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("website")
    .from("platform_layers")
    .select(`*, platform_layer_tools(*, technologies(*))`)
    .eq("is_active", true)
    .order("layer_number");
  return data ?? [];
}

// ── Resources ─────────────────────────────────────────────────────────────────
export async function getResources({ limit = 12, type }: { limit?: number; type?: string } = {}) {
  const supabase = await createClient();
  let q = supabase
    .schema("website")
    .from("resources")
    .select(`*, industries(id, name, slug)`)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (type) q = q.eq("resource_type", type);
  const { data } = await q;
  return data ?? [];
}

// ── FAQs ──────────────────────────────────────────────────────────────────────
export async function getFaqs() {
  const supabase = await createClient();
  const { data } = await supabase
    .schema("website")
    .from("faqs")
    .select(`*, faq_categories(*)`)
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

// ── Technologies ──────────────────────────────────────────────────────────────
export async function getTechnologies({ featured = false } = {}) {
  const supabase = await createClient();
  let q = supabase
    .schema("website")
    .from("technologies")
    .select(`*, technology_categories(*)`)
    .order("sort_order");
  if (featured) q = q.eq("is_featured", true);
  const { data } = await q;
  return data ?? [];
}
