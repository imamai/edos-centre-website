// Auto-generated types for Supabase schema
// Run: npx supabase gen types typescript --project-id kqpltwrhzbjfyxkttwzh > src/types/database.types.ts
// For now this file contains the manually-authored website schema types

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  website: {
    Tables: {
      site_settings: {
        Row: { id: string; key: string; value: Json; description: string | null; updated_at: string };
        Insert: Omit<Database["website"]["Tables"]["site_settings"]["Row"], "id" | "updated_at"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["site_settings"]["Insert"]>;
      };
      services: {
        Row: {
          id: string; slug: string; title: string; tagline: string | null;
          description: string | null; long_description: string | null;
          icon: string | null; cover_image_url: string | null;
          is_featured: boolean; is_active: boolean; sort_order: number;
          seo_title: string | null; seo_description: string | null; seo_keywords: string[] | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["website"]["Tables"]["services"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["services"]["Insert"]>;
      };
      service_capabilities: {
        Row: { id: string; service_id: string; capability: string; sort_order: number };
        Insert: Omit<Database["website"]["Tables"]["service_capabilities"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["service_capabilities"]["Insert"]>;
      };
      industries: {
        Row: {
          id: string; slug: string; name: string; tagline: string | null;
          description: string | null; long_description: string | null;
          icon: string | null; cover_image_url: string | null; hero_stat: string | null;
          is_active: boolean; sort_order: number;
          seo_title: string | null; seo_description: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["website"]["Tables"]["industries"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["industries"]["Insert"]>;
      };
      industry_challenges: {
        Row: { id: string; industry_id: string; challenge: string; sort_order: number };
        Insert: Omit<Database["website"]["Tables"]["industry_challenges"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["industry_challenges"]["Insert"]>;
      };
      industry_solutions: {
        Row: { id: string; industry_id: string; solution: string; sort_order: number };
        Insert: Omit<Database["website"]["Tables"]["industry_solutions"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["industry_solutions"]["Insert"]>;
      };
      industry_outcomes: {
        Row: { id: string; industry_id: string; outcome: string; sort_order: number };
        Insert: Omit<Database["website"]["Tables"]["industry_outcomes"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["industry_outcomes"]["Insert"]>;
      };
      case_studies: {
        Row: {
          id: string; slug: string; title: string; client_name: string | null;
          client_logo_url: string | null; industry_id: string | null;
          tagline: string | null; challenge: string | null; solution: string | null;
          impact: string | null; cover_image_url: string | null; result_summary: string | null;
          is_featured: boolean; is_published: boolean; published_at: string | null;
          sort_order: number; seo_title: string | null; seo_description: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["website"]["Tables"]["case_studies"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["case_studies"]["Insert"]>;
      };
      case_study_kpis: {
        Row: { id: string; case_study_id: string; metric_label: string; metric_value: string; metric_unit: string | null; sort_order: number };
        Insert: Omit<Database["website"]["Tables"]["case_study_kpis"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["case_study_kpis"]["Insert"]>;
      };
      blog_categories: {
        Row: { id: string; name: string; slug: string; description: string | null; color_hex: string; sort_order: number; created_at: string };
        Insert: Omit<Database["website"]["Tables"]["blog_categories"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["blog_categories"]["Insert"]>;
      };
      blog_posts: {
        Row: {
          id: string; slug: string; title: string; excerpt: string | null;
          content: string | null; cover_image_url: string | null;
          category_id: string | null; author_id: string | null;
          author_name: string | null; author_avatar: string | null;
          reading_time_min: number | null; is_published: boolean; is_featured: boolean;
          published_at: string | null; view_count: number;
          seo_title: string | null; seo_description: string | null;
          seo_keywords: string[] | null; og_image_url: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["website"]["Tables"]["blog_posts"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["blog_posts"]["Insert"]>;
      };
      team_members: {
        Row: {
          id: string; profile_id: string | null; full_name: string; job_title: string;
          department: string | null; bio: string | null; photo_url: string | null;
          linkedin_url: string | null; twitter_url: string | null; github_url: string | null;
          is_leadership: boolean; is_active: boolean; sort_order: number;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["website"]["Tables"]["team_members"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["team_members"]["Insert"]>;
      };
      testimonials: {
        Row: {
          id: string; client_name: string; client_title: string | null; client_org: string | null;
          client_photo: string | null; client_logo: string | null; quote: string;
          industry_id: string | null; case_study_id: string | null;
          rating: number | null; is_featured: boolean; is_active: boolean;
          sort_order: number; created_at: string;
        };
        Insert: Omit<Database["website"]["Tables"]["testimonials"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["testimonials"]["Insert"]>;
      };
      metrics: {
        Row: { id: string; key: string; label: string; sub_label: string; description: string | null; sort_order: number; is_active: boolean; updated_at: string };
        Insert: Omit<Database["website"]["Tables"]["metrics"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["metrics"]["Insert"]>;
      };
      platform_layers: {
        Row: {
          id: string; layer_number: number; name: string; subtitle: string | null;
          description: string | null; icon: string | null; color_hex: string;
          sort_order: number; is_active: boolean; created_at: string; updated_at: string;
        };
        Insert: Omit<Database["website"]["Tables"]["platform_layers"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["platform_layers"]["Insert"]>;
      };
      technologies: {
        Row: {
          id: string; category_id: string | null; name: string; slug: string;
          description: string | null; logo_url: string | null; website_url: string | null;
          is_featured: boolean; sort_order: number; created_at: string;
        };
        Insert: Omit<Database["website"]["Tables"]["technologies"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["technologies"]["Insert"]>;
      };
      faqs: {
        Row: { id: string; category_id: string | null; question: string; answer: string; is_active: boolean; sort_order: number; created_at: string; updated_at: string };
        Insert: Omit<Database["website"]["Tables"]["faqs"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["faqs"]["Insert"]>;
      };
      contact_inquiries: {
        Row: {
          id: string; full_name: string; email: string; phone: string | null;
          organization: string | null; subject: string | null; message: string;
          inquiry_type: string; status: string; source_page: string | null;
          utm_source: string | null; utm_medium: string | null; utm_campaign: string | null;
          ip_address: string | null; created_at: string; updated_at: string;
        };
        Insert: Omit<Database["website"]["Tables"]["contact_inquiries"]["Row"], "id" | "created_at" | "updated_at" | "status"> & { id?: string; status?: string };
        Update: Partial<Database["website"]["Tables"]["contact_inquiries"]["Insert"]>;
      };
      consultation_bookings: {
        Row: {
          id: string; full_name: string; email: string; phone: string | null;
          organization: string | null; role_title: string | null;
          service_id: string | null; industry_id: string | null;
          project_summary: string | null; budget_range: string | null;
          preferred_date: string | null; preferred_time: string | null;
          status: string; meeting_link: string | null; notes: string | null;
          source_page: string | null; utm_source: string | null;
          utm_medium: string | null; utm_campaign: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["website"]["Tables"]["consultation_bookings"]["Row"], "id" | "created_at" | "updated_at" | "status"> & { id?: string; status?: string };
        Update: Partial<Database["website"]["Tables"]["consultation_bookings"]["Insert"]>;
      };
      newsletter_subscribers: {
        Row: { id: string; email: string; full_name: string | null; status: string; source: string | null; subscribed_at: string; unsubscribed_at: string | null };
        Insert: Omit<Database["website"]["Tables"]["newsletter_subscribers"]["Row"], "id" | "subscribed_at" | "status"> & { id?: string; status?: string };
        Update: Partial<Database["website"]["Tables"]["newsletter_subscribers"]["Insert"]>;
      };
      resources: {
        Row: {
          id: string; slug: string; title: string; description: string | null;
          resource_type: string; cover_image_url: string | null;
          file_url: string | null; external_url: string | null;
          is_gated: boolean; is_published: boolean; is_featured: boolean;
          published_at: string | null; download_count: number;
          industry_id: string | null; seo_title: string | null; seo_description: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["website"]["Tables"]["resources"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["website"]["Tables"]["resources"]["Insert"]>;
      };
    };
    Views: {
      v_blog_posts_published: {
        Row: {
          id: string; slug: string; title: string; excerpt: string | null;
          cover_image_url: string | null; reading_time_min: number | null;
          published_at: string | null; view_count: number;
          seo_title: string | null; seo_description: string | null; og_image_url: string | null;
          category_name: string | null; category_slug: string | null; category_color: string | null;
          author_name: string | null; author_avatar: string | null;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
  public: {
    Tables: {
      profiles: {
        Row: { id: string; tenant_id: string | null; email: string; full_name: string; phone: string | null; avatar_url: string | null; role: string; is_active: boolean; last_login_at: string | null; created_at: string; updated_at: string };
        Insert: never;
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_super_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
  };
}

// ── Convenience row types ─────────────────────────────────────────────────────
export type Service      = Database["website"]["Tables"]["services"]["Row"];
export type Industry     = Database["website"]["Tables"]["industries"]["Row"];
export type CaseStudy    = Database["website"]["Tables"]["case_studies"]["Row"];
export type CaseStudyKpi = Database["website"]["Tables"]["case_study_kpis"]["Row"];
export type BlogPost     = Database["website"]["Tables"]["blog_posts"]["Row"];
export type BlogCategory = Database["website"]["Tables"]["blog_categories"]["Row"];
export type TeamMember   = Database["website"]["Tables"]["team_members"]["Row"];
export type Testimonial  = Database["website"]["Tables"]["testimonials"]["Row"];
export type Metric       = Database["website"]["Tables"]["metrics"]["Row"];
export type Resource     = Database["website"]["Tables"]["resources"]["Row"];
export type PlatformLayer = Database["website"]["Tables"]["platform_layers"]["Row"];
export type Technology   = Database["website"]["Tables"]["technologies"]["Row"];
export type Faq          = Database["website"]["Tables"]["faqs"]["Row"];
