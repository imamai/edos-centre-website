import { createStaticClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

// ── Services ──────────────────────────────────────────────────────────────────
const SERVICE_SELECT = `*, edoscentre_service_capabilities(*), edoscentre_service_outcomes(*), edoscentre_service_technologies(technology_id, edoscentre_technologies(*))`;

export type ServiceWithContent = Database["public"]["Tables"]["edoscentre_services"]["Row"] & {
  edoscentre_service_capabilities: Database["public"]["Tables"]["edoscentre_service_capabilities"]["Row"][];
  edoscentre_service_outcomes: Database["public"]["Tables"]["edoscentre_service_outcomes"]["Row"][];
  edoscentre_service_technologies: { technology_id: string; edoscentre_technologies: Database["public"]["Tables"]["edoscentre_technologies"]["Row"] | null }[];
};

export async function getServices(): Promise<ServiceWithContent[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("edoscentre_services")
    .select(SERVICE_SELECT)
    .eq("is_active", true)
    .order("sort_order");
  return (data ?? []) as unknown as ServiceWithContent[];
}

export async function getServiceBySlug(slug: string): Promise<ServiceWithContent | null> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("edoscentre_services")
    .select(SERVICE_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data as unknown as ServiceWithContent | null;
}

// ── Industries ────────────────────────────────────────────────────────────────
export async function getIndustries() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("edoscentre_industries")
    .select(`*, edoscentre_industry_challenges(*), edoscentre_industry_solutions(*), edoscentre_industry_outcomes(*), edoscentre_industry_technologies(technology_id, edoscentre_technologies(*))`)
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

export async function getIndustryBySlug(slug: string) {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("edoscentre_industries")
    .select(`*, edoscentre_industry_challenges(*), edoscentre_industry_solutions(*), edoscentre_industry_outcomes(*), edoscentre_industry_technologies(technology_id, edoscentre_technologies(*))`)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data;
}

// ── Case Studies ──────────────────────────────────────────────────────────────
export async function getCaseStudies({ featured = false, limit = 12 } = {}) {
  const supabase = createStaticClient();
  let q = supabase
    .from("edoscentre_case_studies")
    .select(`*, edoscentre_case_study_kpis(*), edoscentre_case_study_technologies(technology_id, edoscentre_technologies(*)), edoscentre_industries(id, name, slug, icon)`)
    .eq("is_published", true)
    .order("sort_order")
    .limit(limit);
  if (featured) q = q.eq("is_featured", true);
  const { data } = await q;
  return data ?? [];
}

export async function getCaseStudyBySlug(slug: string) {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("edoscentre_case_studies")
    .select(`*, edoscentre_case_study_kpis(*), edoscentre_case_study_technologies(technology_id, edoscentre_technologies(*)), edoscentre_industries(id, name, slug)`)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

// ── Blog ──────────────────────────────────────────────────────────────────────
export async function getBlogPosts({ limit = 9, categorySlug }: { limit?: number; categorySlug?: string } = {}) {
  const supabase = createStaticClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = supabase
    .from("edoscentre_v_blog_posts_published")
    .select("*")
    .limit(limit);
  if (categorySlug) q = q.eq("category_slug", categorySlug);
  const { data } = await q;
  return (data ?? []) as Database["public"]["Views"]["edoscentre_v_blog_posts_published"]["Row"][];
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("edoscentre_blog_posts")
    .select(`*, edoscentre_blog_categories(*), edoscentre_blog_post_tags(edoscentre_blog_tags(*))`)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

export async function getFeaturedBlogPosts(limit = 3) {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("edoscentre_v_blog_posts_published")
    .select("*")
    .eq("is_featured" as never, true)
    .limit(limit);
  return data ?? [];
}

// ── Metrics ───────────────────────────────────────────────────────────────────
export async function getMetrics() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("edoscentre_metrics")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

// ── Team ──────────────────────────────────────────────────────────────────────
export async function getTeamMembers({ leadershipOnly = false } = {}) {
  const supabase = createStaticClient();
  let q = supabase
    .from("edoscentre_team_members")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (leadershipOnly) q = q.eq("is_leadership", true);
  const { data } = await q;
  return data ?? [];
}

// ── Testimonials ──────────────────────────────────────────────────────────────
export async function getTestimonials({ featured = false } = {}) {
  const supabase = createStaticClient();
  let q = supabase
    .from("edoscentre_testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (featured) q = q.eq("is_featured", true);
  const { data } = await q;
  return data ?? [];
}

// ── Platform Layers ───────────────────────────────────────────────────────────
export async function getPlatformLayers() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("edoscentre_platform_layers")
    .select(`*, edoscentre_platform_layer_tools(*, edoscentre_technologies(*))`)
    .eq("is_active", true)
    .order("layer_number");
  return data ?? [];
}

// ── Resources ─────────────────────────────────────────────────────────────────
export async function getResources({ limit = 12, type }: { limit?: number; type?: string } = {}) {
  const supabase = createStaticClient();
  let q = supabase
    .from("edoscentre_resources")
    .select(`*, edoscentre_industries(id, name, slug)`)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (type) q = q.eq("resource_type", type);
  const { data } = await q;
  return data ?? [];
}

// ── FAQs ──────────────────────────────────────────────────────────────────────
export async function getFaqs() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("edoscentre_faqs")
    .select(`*, edoscentre_faq_categories(*)`)
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

// ── Technologies ──────────────────────────────────────────────────────────────
export async function getTechnologies({ featured = false } = {}) {
  const supabase = createStaticClient();
  let q = supabase
    .from("edoscentre_technologies")
    .select(`*, edoscentre_technology_categories(*)`)
    .order("sort_order");
  if (featured) q = q.eq("is_featured", true);
  const { data } = await q;
  return data ?? [];
}
