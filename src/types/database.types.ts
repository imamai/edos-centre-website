// Auto-generated types for Supabase schema
// Run: npx supabase gen types typescript --project-id sedsjjmjnikppfaecaya > src/types/database.types.ts
// For now this file contains the manually-authored website schema types

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      edoscentre_site_settings: {
        Row: { id: string; key: string; value: Json; description: string | null; updated_at: string };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_site_settings"]["Row"], "id" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_site_settings"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_services: {
        Row: {
          id: string; slug: string; title: string; tagline: string | null;
          description: string | null; long_description: string | null;
          icon: string | null; cover_image_url: string | null;
          is_featured: boolean; is_active: boolean; sort_order: number;
          seo_title: string | null; seo_description: string | null; seo_keywords: string[] | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_services"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_services"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_service_capabilities: {
        Row: { id: string; service_id: string; capability: string; sort_order: number };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_service_capabilities"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_service_capabilities"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_service_technologies: {
        Row: { service_id: string; technology_id: string };
        Insert: Database["public"]["Tables"]["edoscentre_service_technologies"]["Row"];
        Update: Partial<Database["public"]["Tables"]["edoscentre_service_technologies"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_industries: {
        Row: {
          id: string; slug: string; name: string; tagline: string | null;
          description: string | null; long_description: string | null;
          icon: string | null; cover_image_url: string | null; hero_stat: string | null;
          is_active: boolean; sort_order: number;
          seo_title: string | null; seo_description: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_industries"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_industries"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_industry_challenges: {
        Row: { id: string; industry_id: string; challenge: string; sort_order: number };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_industry_challenges"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_industry_challenges"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_industry_solutions: {
        Row: { id: string; industry_id: string; solution: string; sort_order: number };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_industry_solutions"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_industry_solutions"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_industry_outcomes: {
        Row: { id: string; industry_id: string; outcome: string; sort_order: number };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_industry_outcomes"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_industry_outcomes"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_industry_technologies: {
        Row: { industry_id: string; technology_id: string };
        Insert: Database["public"]["Tables"]["edoscentre_industry_technologies"]["Row"];
        Update: Partial<Database["public"]["Tables"]["edoscentre_industry_technologies"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_case_studies: {
        Row: {
          id: string; slug: string; title: string; client_name: string | null;
          client_logo_url: string | null; industry_id: string | null;
          tagline: string | null; challenge: string | null; solution: string | null;
          impact: string | null; cover_image_url: string | null; result_summary: string | null;
          is_featured: boolean; is_published: boolean; published_at: string | null;
          sort_order: number; seo_title: string | null; seo_description: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_case_studies"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_case_studies"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_case_study_kpis: {
        Row: { id: string; case_study_id: string; metric_label: string; metric_value: string; metric_unit: string | null; sort_order: number };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_case_study_kpis"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_case_study_kpis"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_case_study_technologies: {
        Row: { case_study_id: string; technology_id: string };
        Insert: Database["public"]["Tables"]["edoscentre_case_study_technologies"]["Row"];
        Update: Partial<Database["public"]["Tables"]["edoscentre_case_study_technologies"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_blog_categories: {
        Row: { id: string; name: string; slug: string; description: string | null; color_hex: string; sort_order: number; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_blog_categories"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_blog_categories"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_blog_tags: {
        Row: { id: string; name: string; slug: string; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_blog_tags"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_blog_tags"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_blog_posts: {
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
        Insert: Omit<Database["public"]["Tables"]["edoscentre_blog_posts"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_blog_posts"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_blog_post_tags: {
        Row: { blog_post_id: string; tag_id: string };
        Insert: Database["public"]["Tables"]["edoscentre_blog_post_tags"]["Row"];
        Update: Partial<Database["public"]["Tables"]["edoscentre_blog_post_tags"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_team_members: {
        Row: {
          id: string; profile_id: string | null; full_name: string; job_title: string;
          department: string | null; bio: string | null; photo_url: string | null;
          linkedin_url: string | null; twitter_url: string | null; github_url: string | null;
          is_leadership: boolean; is_active: boolean; sort_order: number;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_team_members"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_team_members"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_testimonials: {
        Row: {
          id: string; client_name: string; client_title: string | null; client_org: string | null;
          client_photo: string | null; client_logo: string | null; quote: string;
          industry_id: string | null; case_study_id: string | null;
          rating: number | null; is_featured: boolean; is_active: boolean;
          sort_order: number; created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_testimonials"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_testimonials"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_metrics: {
        Row: { id: string; key: string; label: string; sub_label: string; description: string | null; sort_order: number; is_active: boolean; updated_at: string };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_metrics"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_metrics"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_platform_layers: {
        Row: {
          id: string; layer_number: number; name: string; subtitle: string | null;
          description: string | null; icon: string | null; color_hex: string;
          sort_order: number; is_active: boolean; created_at: string; updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_platform_layers"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_platform_layers"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_platform_layer_tools: {
        Row: { id: string; layer_id: string; technology_id: string | null; custom_name: string | null; custom_icon: string | null; sort_order: number };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_platform_layer_tools"]["Row"], "id"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_platform_layer_tools"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_technologies: {
        Row: {
          id: string; category_id: string | null; name: string; slug: string;
          description: string | null; logo_url: string | null; website_url: string | null;
          is_featured: boolean; sort_order: number; created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_technologies"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_technologies"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_technology_categories: {
        Row: { id: string; name: string; slug: string; sort_order: number; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_technology_categories"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_technology_categories"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_faqs: {
        Row: { id: string; category_id: string | null; question: string; answer: string; is_active: boolean; sort_order: number; created_at: string; updated_at: string };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_faqs"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_faqs"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_faq_categories: {
        Row: { id: string; name: string; slug: string; sort_order: number; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_faq_categories"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_faq_categories"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_contact_inquiries: {
        Row: {
          id: string; full_name: string; email: string; phone: string | null;
          organization: string | null; subject: string | null; message: string;
          inquiry_type: string; status: string; source_page: string | null;
          utm_source: string | null; utm_medium: string | null; utm_campaign: string | null;
          ip_address: string | null; created_at: string; updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_contact_inquiries"]["Row"], "id" | "created_at" | "updated_at" | "status"> & { id?: string; status?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_contact_inquiries"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_consultation_bookings: {
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
        Insert: Omit<Database["public"]["Tables"]["edoscentre_consultation_bookings"]["Row"], "id" | "created_at" | "updated_at" | "status" | "service_id" | "industry_id" | "meeting_link" | "notes"> & { id?: string; status?: string; service_id?: string | null; industry_id?: string | null; meeting_link?: string | null; notes?: string | null };
        Update: Partial<Database["public"]["Tables"]["edoscentre_consultation_bookings"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_newsletter_subscribers: {
        Row: { id: string; email: string; full_name: string | null; status: string; source: string | null; subscribed_at: string; unsubscribed_at: string | null };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_newsletter_subscribers"]["Row"], "id" | "subscribed_at" | "status" | "unsubscribed_at"> & { id?: string; status?: string; unsubscribed_at?: string | null };
        Update: Partial<Database["public"]["Tables"]["edoscentre_newsletter_subscribers"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_resources: {
        Row: {
          id: string; slug: string; title: string; description: string | null;
          resource_type: string; cover_image_url: string | null;
          file_url: string | null; external_url: string | null;
          is_gated: boolean; is_published: boolean; is_featured: boolean;
          published_at: string | null; download_count: number;
          industry_id: string | null; seo_title: string | null; seo_description: string | null;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_resources"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_resources"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_navigation_items: {
        Row: {
          id: string; label: string; href: string; parent_id: string | null;
          menu_slot: string; sort_order: number; is_active: boolean; open_in_new: boolean;
          created_at: string; updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_navigation_items"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_navigation_items"]["Insert"]>;
        Relationships: [];
      };
      edoscentre_media_assets: {
        Row: {
          id: string; bucket: string; storage_path: string; public_url: string;
          alt_text: string | null; width: number | null; height: number | null;
          file_size: number | null; mime_type: string | null; uploaded_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["edoscentre_media_assets"]["Row"], "id" | "created_at"> & { id?: string };
        Update: Partial<Database["public"]["Tables"]["edoscentre_media_assets"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      edoscentre_v_blog_posts_published: {
        Row: {
          id: string; slug: string; title: string; excerpt: string | null;
          cover_image_url: string | null; reading_time_min: number | null;
          published_at: string | null; view_count: number;
          seo_title: string | null; seo_description: string | null; og_image_url: string | null;
          category_name: string | null; category_slug: string | null; category_color: string | null;
          author_name: string | null; author_avatar: string | null; is_featured: boolean;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ── Convenience row types ─────────────────────────────────────────────────────
export type Service      = Database["public"]["Tables"]["edoscentre_services"]["Row"];
export type Industry     = Database["public"]["Tables"]["edoscentre_industries"]["Row"];
export type CaseStudy    = Database["public"]["Tables"]["edoscentre_case_studies"]["Row"];
export type CaseStudyKpi = Database["public"]["Tables"]["edoscentre_case_study_kpis"]["Row"];
export type BlogPost     = Database["public"]["Tables"]["edoscentre_blog_posts"]["Row"];
export type BlogCategory = Database["public"]["Tables"]["edoscentre_blog_categories"]["Row"];
export type TeamMember   = Database["public"]["Tables"]["edoscentre_team_members"]["Row"];
export type Testimonial  = Database["public"]["Tables"]["edoscentre_testimonials"]["Row"];
export type Metric       = Database["public"]["Tables"]["edoscentre_metrics"]["Row"];
export type Resource     = Database["public"]["Tables"]["edoscentre_resources"]["Row"];
export type PlatformLayer = Database["public"]["Tables"]["edoscentre_platform_layers"]["Row"];
export type Technology   = Database["public"]["Tables"]["edoscentre_technologies"]["Row"];
export type Faq          = Database["public"]["Tables"]["edoscentre_faqs"]["Row"];
