-- ============================================================================
-- Migration 006 – Edos Centre Website CMS Schema
-- ============================================================================
-- Schema:  website  (isolated from public POS/HMIS/SaaS schemas)
-- Naming:  plural snake_case for all tables
-- Reuse:   references public.profiles for authorship only
-- Safe:    all statements use IF NOT EXISTS / DO $$ guards
-- ============================================================================

-- ── Enable extensions (safe no-ops if already enabled) ───────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ── Create dedicated schema ───────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS website;

-- ── Grant usage ───────────────────────────────────────────────────────────────
GRANT USAGE ON SCHEMA website TO authenticated, anon, service_role;

-- ============================================================================
-- SHARED TRIGGER FUNCTION (reuse public one if exists, else create)
-- ============================================================================
CREATE OR REPLACE FUNCTION website.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

-- ============================================================================
-- 1. SITE_SETTINGS  –  global CMS key/value store
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.site_settings (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  key          TEXT        NOT NULL UNIQUE,   -- e.g. 'site_title', 'og_image'
  value        JSONB       NOT NULL DEFAULT '{}',
  description  TEXT,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_site_settings_key ON website.site_settings (key);

-- ============================================================================
-- 2. MEDIA_ASSETS  –  centralised media library for website CMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.media_assets (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  bucket       TEXT        NOT NULL DEFAULT 'website',
  storage_path TEXT        NOT NULL UNIQUE,   -- path inside the bucket
  public_url   TEXT        NOT NULL,
  alt_text     TEXT,
  width        INT,
  height       INT,
  file_size    INT,          -- bytes
  mime_type    TEXT,
  uploaded_by  UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. NAVIGATION_ITEMS  –  CMS-managed nav structure
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.navigation_items (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  label        TEXT        NOT NULL,
  href         TEXT        NOT NULL,
  parent_id    UUID        REFERENCES website.navigation_items(id) ON DELETE CASCADE,
  menu_slot    TEXT        NOT NULL DEFAULT 'primary'
                           CHECK (menu_slot IN ('primary','footer_company','footer_services','footer_resources')),
  sort_order   INT         NOT NULL DEFAULT 0,
  is_active    BOOLEAN     NOT NULL DEFAULT true,
  open_in_new  BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_nav_slot  ON website.navigation_items (menu_slot, sort_order);
CREATE INDEX IF NOT EXISTS idx_ws_nav_parent ON website.navigation_items (parent_id);

CREATE OR REPLACE TRIGGER trg_ws_navigation_items_updated_at
  BEFORE UPDATE ON website.navigation_items
  FOR EACH ROW EXECUTE FUNCTION website.set_updated_at();

-- ============================================================================
-- 4. TECHNOLOGY_CATEGORIES  –  e.g. Data Collection, Analytics, Infrastructure
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.technology_categories (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT        NOT NULL UNIQUE,
  slug        TEXT        NOT NULL UNIQUE,
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. TECHNOLOGIES  –  individual tools/platforms Edos Centre uses
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.technologies (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id     UUID        REFERENCES website.technology_categories(id) ON DELETE SET NULL,
  name            TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  description     TEXT,
  logo_url        TEXT,
  website_url     TEXT,
  is_featured     BOOLEAN     NOT NULL DEFAULT false,
  sort_order      INT         NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_tech_category ON website.technologies (category_id);
CREATE INDEX IF NOT EXISTS idx_ws_tech_featured  ON website.technologies (is_featured);

-- ============================================================================
-- 6. PLATFORM_LAYERS  –  Edos Digital Transformation Framework (5 layers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.platform_layers (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  layer_number INT         NOT NULL UNIQUE CHECK (layer_number BETWEEN 1 AND 10),
  name         TEXT        NOT NULL,       -- e.g. 'Data Collection'
  subtitle     TEXT,
  description  TEXT,
  icon         TEXT,                       -- lucide icon name or SVG
  color_hex    TEXT        NOT NULL DEFAULT '#E31E24',
  sort_order   INT         NOT NULL DEFAULT 0,
  is_active    BOOLEAN     NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_ws_platform_layers_updated_at
  BEFORE UPDATE ON website.platform_layers
  FOR EACH ROW EXECUTE FUNCTION website.set_updated_at();

-- ============================================================================
-- 7. PLATFORM_LAYER_TOOLS  –  tools within each layer
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.platform_layer_tools (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  layer_id     UUID        NOT NULL REFERENCES website.platform_layers(id) ON DELETE CASCADE,
  technology_id UUID       REFERENCES website.technologies(id) ON DELETE SET NULL,
  custom_name  TEXT,           -- fallback if technology_id is NULL
  custom_icon  TEXT,
  sort_order   INT         NOT NULL DEFAULT 0,
  CONSTRAINT plt_has_name CHECK (technology_id IS NOT NULL OR custom_name IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_ws_plt_layer ON website.platform_layer_tools (layer_id);

-- ============================================================================
-- 8. SERVICES  –  Edos Centre service catalogue
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.services (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT        NOT NULL UNIQUE,
  title            TEXT        NOT NULL,
  tagline          TEXT,
  description      TEXT,
  long_description TEXT,
  icon             TEXT,           -- lucide icon name
  cover_image_url  TEXT,
  is_featured      BOOLEAN     NOT NULL DEFAULT false,
  is_active        BOOLEAN     NOT NULL DEFAULT true,
  sort_order       INT         NOT NULL DEFAULT 0,
  seo_title        TEXT,
  seo_description  TEXT,
  seo_keywords     TEXT[],
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_services_featured ON website.services (is_featured);
CREATE INDEX IF NOT EXISTS idx_ws_services_active   ON website.services (is_active, sort_order);

CREATE OR REPLACE TRIGGER trg_ws_services_updated_at
  BEFORE UPDATE ON website.services
  FOR EACH ROW EXECUTE FUNCTION website.set_updated_at();

-- ============================================================================
-- 9. SERVICE_CAPABILITIES  –  bullet-point capabilities per service
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.service_capabilities (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id  UUID    NOT NULL REFERENCES website.services(id) ON DELETE CASCADE,
  capability  TEXT    NOT NULL,
  sort_order  INT     NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ws_svcap_service ON website.service_capabilities (service_id);

-- ============================================================================
-- 10. SERVICE_TECHNOLOGIES  –  which technologies power each service
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.service_technologies (
  service_id     UUID NOT NULL REFERENCES website.services(id) ON DELETE CASCADE,
  technology_id  UUID NOT NULL REFERENCES website.technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (service_id, technology_id)
);

-- ============================================================================
-- 11. INDUSTRIES  –  industry verticals
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.industries (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT        NOT NULL UNIQUE,
  name             TEXT        NOT NULL,
  tagline          TEXT,
  description      TEXT,
  long_description TEXT,
  icon             TEXT,
  cover_image_url  TEXT,
  hero_stat        TEXT,       -- e.g. '500M+ records processed in healthcare'
  is_active        BOOLEAN     NOT NULL DEFAULT true,
  sort_order       INT         NOT NULL DEFAULT 0,
  seo_title        TEXT,
  seo_description  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_ws_industries_updated_at
  BEFORE UPDATE ON website.industries
  FOR EACH ROW EXECUTE FUNCTION website.set_updated_at();

-- ============================================================================
-- 12. INDUSTRY_CHALLENGES  –  pain points per industry
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.industry_challenges (
  id           UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry_id  UUID    NOT NULL REFERENCES website.industries(id) ON DELETE CASCADE,
  challenge    TEXT    NOT NULL,
  sort_order   INT     NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ws_ichal_industry ON website.industry_challenges (industry_id);

-- ============================================================================
-- 13. INDUSTRY_SOLUTIONS  –  how Edos solves each industry's challenges
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.industry_solutions (
  id           UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry_id  UUID    NOT NULL REFERENCES website.industries(id) ON DELETE CASCADE,
  solution     TEXT    NOT NULL,
  sort_order   INT     NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ws_isol_industry ON website.industry_solutions (industry_id);

-- ============================================================================
-- 14. INDUSTRY_OUTCOMES  –  expected results / KPIs per industry
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.industry_outcomes (
  id           UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry_id  UUID    NOT NULL REFERENCES website.industries(id) ON DELETE CASCADE,
  outcome      TEXT    NOT NULL,
  sort_order   INT     NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ws_iout_industry ON website.industry_outcomes (industry_id);

-- ============================================================================
-- 15. INDUSTRY_TECHNOLOGIES  –  tech used per industry vertical
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.industry_technologies (
  industry_id    UUID NOT NULL REFERENCES website.industries(id) ON DELETE CASCADE,
  technology_id  UUID NOT NULL REFERENCES website.technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (industry_id, technology_id)
);

-- ============================================================================
-- 16. CASE_STUDIES  –  success stories / project showcases
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.case_studies (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT        NOT NULL UNIQUE,
  title            TEXT        NOT NULL,
  client_name      TEXT,
  client_logo_url  TEXT,
  industry_id      UUID        REFERENCES website.industries(id) ON DELETE SET NULL,
  tagline          TEXT,
  challenge        TEXT,
  solution         TEXT,
  impact           TEXT,
  cover_image_url  TEXT,
  result_summary   TEXT,       -- one-liner for card display
  is_featured      BOOLEAN     NOT NULL DEFAULT false,
  is_published     BOOLEAN     NOT NULL DEFAULT false,
  published_at     TIMESTAMPTZ,
  sort_order       INT         NOT NULL DEFAULT 0,
  seo_title        TEXT,
  seo_description  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_cs_published  ON website.case_studies (is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ws_cs_featured   ON website.case_studies (is_featured);
CREATE INDEX IF NOT EXISTS idx_ws_cs_industry   ON website.case_studies (industry_id);

CREATE OR REPLACE TRIGGER trg_ws_case_studies_updated_at
  BEFORE UPDATE ON website.case_studies
  FOR EACH ROW EXECUTE FUNCTION website.set_updated_at();

-- ============================================================================
-- 17. CASE_STUDY_KPIS  –  measurable outcomes per case study
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.case_study_kpis (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_study_id UUID    NOT NULL REFERENCES website.case_studies(id) ON DELETE CASCADE,
  metric_label  TEXT    NOT NULL,   -- e.g. 'Records Digitized'
  metric_value  TEXT    NOT NULL,   -- e.g. '2.4M'
  metric_unit   TEXT,              -- optional unit label
  sort_order    INT     NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ws_kpi_cs ON website.case_study_kpis (case_study_id);

-- ============================================================================
-- 18. CASE_STUDY_TECHNOLOGIES  –  tech stack per case study
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.case_study_technologies (
  case_study_id  UUID NOT NULL REFERENCES website.case_studies(id) ON DELETE CASCADE,
  technology_id  UUID NOT NULL REFERENCES website.technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (case_study_id, technology_id)
);

-- ============================================================================
-- 19. BLOG_CATEGORIES  –  marketing blog categories
--     NOTE: distinct from public.blog_posts (clinic/tenant-scoped healthcare blog)
--           website.blog_posts is Edos Centre's own thought-leadership content
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.blog_categories (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT        NOT NULL UNIQUE,
  slug        TEXT        NOT NULL UNIQUE,
  description TEXT,
  color_hex   TEXT        NOT NULL DEFAULT '#E31E24',
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 20. BLOG_TAGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.blog_tags (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT        NOT NULL UNIQUE,
  slug       TEXT        NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 21. BLOG_POSTS  –  Edos Centre marketing/thought-leadership blog
--     Reuses public.profiles for author linkage
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.blog_posts (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT        NOT NULL UNIQUE,
  title            TEXT        NOT NULL,
  excerpt          TEXT,
  content          TEXT,       -- MDX / rich text
  cover_image_url  TEXT,
  category_id      UUID        REFERENCES website.blog_categories(id) ON DELETE SET NULL,
  author_id        UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,  -- reuse existing profiles
  author_name      TEXT,       -- fallback if author_id is null
  author_avatar    TEXT,
  reading_time_min INT,
  is_published     BOOLEAN     NOT NULL DEFAULT false,
  is_featured      BOOLEAN     NOT NULL DEFAULT false,
  published_at     TIMESTAMPTZ,
  view_count       INT         NOT NULL DEFAULT 0,
  seo_title        TEXT,
  seo_description  TEXT,
  seo_keywords     TEXT[],
  og_image_url     TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_bp_published  ON website.blog_posts (is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ws_bp_featured   ON website.blog_posts (is_featured);
CREATE INDEX IF NOT EXISTS idx_ws_bp_category   ON website.blog_posts (category_id);
CREATE INDEX IF NOT EXISTS idx_ws_bp_slug       ON website.blog_posts (slug);

-- Full-text search index on blog posts
CREATE INDEX IF NOT EXISTS idx_ws_bp_fts ON website.blog_posts
  USING gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(excerpt,'') || ' ' || coalesce(content,'')));

CREATE OR REPLACE TRIGGER trg_ws_blog_posts_updated_at
  BEFORE UPDATE ON website.blog_posts
  FOR EACH ROW EXECUTE FUNCTION website.set_updated_at();

-- ============================================================================
-- 22. BLOG_POST_TAGS  –  many-to-many junction
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.blog_post_tags (
  blog_post_id  UUID NOT NULL REFERENCES website.blog_posts(id) ON DELETE CASCADE,
  tag_id        UUID NOT NULL REFERENCES website.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (blog_post_id, tag_id)
);

-- ============================================================================
-- 23. RESOURCES  –  whitepapers, guides, reports, tutorials
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.resources (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT        NOT NULL UNIQUE,
  title            TEXT        NOT NULL,
  description      TEXT,
  resource_type    TEXT        NOT NULL DEFAULT 'guide'
                   CHECK (resource_type IN ('whitepaper','guide','case_study','tutorial','industry_report','webinar')),
  cover_image_url  TEXT,
  file_url         TEXT,       -- gated download URL
  external_url     TEXT,       -- for webinars / external content
  is_gated         BOOLEAN     NOT NULL DEFAULT true,  -- requires email capture
  is_published     BOOLEAN     NOT NULL DEFAULT false,
  is_featured      BOOLEAN     NOT NULL DEFAULT false,
  published_at     TIMESTAMPTZ,
  download_count   INT         NOT NULL DEFAULT 0,
  industry_id      UUID        REFERENCES website.industries(id) ON DELETE SET NULL,
  seo_title        TEXT,
  seo_description  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_resources_type      ON website.resources (resource_type);
CREATE INDEX IF NOT EXISTS idx_ws_resources_published ON website.resources (is_published, published_at DESC);

CREATE OR REPLACE TRIGGER trg_ws_resources_updated_at
  BEFORE UPDATE ON website.resources
  FOR EACH ROW EXECUTE FUNCTION website.set_updated_at();

-- ============================================================================
-- 24. TEAM_MEMBERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.team_members (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id    UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,  -- reuse if they have a system account
  full_name     TEXT        NOT NULL,
  job_title     TEXT        NOT NULL,
  department    TEXT,
  bio           TEXT,
  photo_url     TEXT,
  linkedin_url  TEXT,
  twitter_url   TEXT,
  github_url    TEXT,
  is_leadership BOOLEAN     NOT NULL DEFAULT false,
  is_active     BOOLEAN     NOT NULL DEFAULT true,
  sort_order    INT         NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_team_active ON website.team_members (is_active, sort_order);

CREATE OR REPLACE TRIGGER trg_ws_team_members_updated_at
  BEFORE UPDATE ON website.team_members
  FOR EACH ROW EXECUTE FUNCTION website.set_updated_at();

-- ============================================================================
-- 25. TESTIMONIALS
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.testimonials (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name     TEXT        NOT NULL,
  client_title    TEXT,
  client_org      TEXT,
  client_photo    TEXT,
  client_logo     TEXT,
  quote           TEXT        NOT NULL,
  industry_id     UUID        REFERENCES website.industries(id) ON DELETE SET NULL,
  case_study_id   UUID        REFERENCES website.case_studies(id) ON DELETE SET NULL,
  rating          INT         CHECK (rating BETWEEN 1 AND 5),
  is_featured     BOOLEAN     NOT NULL DEFAULT false,
  is_active       BOOLEAN     NOT NULL DEFAULT true,
  sort_order      INT         NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_test_featured ON website.testimonials (is_featured, sort_order);

-- ============================================================================
-- 26. FAQ_CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.faq_categories (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT        NOT NULL UNIQUE,
  slug        TEXT        NOT NULL UNIQUE,
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 27. FAQS
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.faqs (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id  UUID        REFERENCES website.faq_categories(id) ON DELETE SET NULL,
  question     TEXT        NOT NULL,
  answer       TEXT        NOT NULL,
  is_active    BOOLEAN     NOT NULL DEFAULT true,
  sort_order   INT         NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_faqs_category ON website.faqs (category_id, sort_order);

CREATE OR REPLACE TRIGGER trg_ws_faqs_updated_at
  BEFORE UPDATE ON website.faqs
  FOR EACH ROW EXECUTE FUNCTION website.set_updated_at();

-- ============================================================================
-- 28. METRICS  –  company statistics shown on the website
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.metrics (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  key         TEXT        NOT NULL UNIQUE,   -- e.g. 'projects_delivered'
  label       TEXT        NOT NULL,          -- '50+'
  sub_label   TEXT        NOT NULL,          -- 'Projects Delivered'
  description TEXT,
  sort_order  INT         NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 29. CONTACT_INQUIRIES  –  general contact form leads
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.contact_inquiries (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name     TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  phone         TEXT,
  organization  TEXT,
  subject       TEXT,
  message       TEXT        NOT NULL,
  inquiry_type  TEXT        NOT NULL DEFAULT 'general'
                CHECK (inquiry_type IN ('general','partnership','project','careers','media')),
  status        TEXT        NOT NULL DEFAULT 'new'
                CHECK (status IN ('new','in_review','responded','closed','spam')),
  source_page   TEXT,       -- which page the form was submitted from
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  ip_address    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_contact_status   ON website.contact_inquiries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ws_contact_email    ON website.contact_inquiries (email);

CREATE OR REPLACE TRIGGER trg_ws_contact_inquiries_updated_at
  BEFORE UPDATE ON website.contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION website.set_updated_at();

-- ============================================================================
-- 30. CONSULTATION_BOOKINGS  –  "Book Consultation" CTA leads
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.consultation_bookings (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name       TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  phone           TEXT,
  organization    TEXT,
  role_title      TEXT,
  service_id      UUID        REFERENCES website.services(id) ON DELETE SET NULL,
  industry_id     UUID        REFERENCES website.industries(id) ON DELETE SET NULL,
  project_summary TEXT,
  budget_range    TEXT        CHECK (budget_range IN ('under_500k','500k_2m','2m_10m','above_10m','not_sure')),
  preferred_date  DATE,
  preferred_time  TEXT,       -- morning / afternoon / flexible
  status          TEXT        NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','scheduled','completed','cancelled','no_show')),
  meeting_link    TEXT,       -- Zoom / Teams link sent to client
  notes           TEXT,       -- internal notes
  source_page     TEXT,
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ws_cb_status ON website.consultation_bookings (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ws_cb_email  ON website.consultation_bookings (email);
CREATE INDEX IF NOT EXISTS idx_ws_cb_date   ON website.consultation_bookings (preferred_date);

CREATE OR REPLACE TRIGGER trg_ws_consultation_bookings_updated_at
  BEFORE UPDATE ON website.consultation_bookings
  FOR EACH ROW EXECUTE FUNCTION website.set_updated_at();

-- ============================================================================
-- 31. NEWSLETTER_SUBSCRIBERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS website.newsletter_subscribers (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT        NOT NULL UNIQUE,
  full_name     TEXT,
  status        TEXT        NOT NULL DEFAULT 'active'
                CHECK (status IN ('active','unsubscribed','bounced')),
  source        TEXT,       -- 'footer_form', 'resource_gate', 'blog', etc.
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ws_newsletter_status ON website.newsletter_subscribers (status);
CREATE INDEX IF NOT EXISTS idx_ws_newsletter_email  ON website.newsletter_subscribers (email);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all website tables
ALTER TABLE website.site_settings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.media_assets           ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.navigation_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.technology_categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.technologies           ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.platform_layers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.platform_layer_tools   ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.services               ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.service_capabilities   ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.service_technologies   ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.industries             ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.industry_challenges    ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.industry_solutions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.industry_outcomes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.industry_technologies  ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.case_studies           ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.case_study_kpis        ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.case_study_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.blog_categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.blog_tags              ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.blog_posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.blog_post_tags         ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.resources              ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.team_members           ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.testimonials           ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.faq_categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.faqs                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.metrics                ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.contact_inquiries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.consultation_bookings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE website.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- ── Public READ policies (website visitors / anon) ───────────────────────────

CREATE POLICY "ws_public_read_site_settings"       ON website.site_settings          FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_nav"                 ON website.navigation_items       FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "ws_public_read_tech_categories"     ON website.technology_categories  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_technologies"        ON website.technologies           FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_platform_layers"     ON website.platform_layers        FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "ws_public_read_platform_tools"      ON website.platform_layer_tools   FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_services"            ON website.services               FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "ws_public_read_svc_caps"            ON website.service_capabilities   FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_svc_tech"            ON website.service_technologies   FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_industries"          ON website.industries             FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "ws_public_read_ind_challenges"      ON website.industry_challenges    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_ind_solutions"       ON website.industry_solutions     FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_ind_outcomes"        ON website.industry_outcomes      FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_ind_tech"            ON website.industry_technologies  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_case_studies"        ON website.case_studies           FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "ws_public_read_cs_kpis"             ON website.case_study_kpis        FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_cs_tech"             ON website.case_study_technologies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_blog_cats"           ON website.blog_categories        FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_blog_tags"           ON website.blog_tags              FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_blog_posts"          ON website.blog_posts             FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "ws_public_read_blog_post_tags"      ON website.blog_post_tags         FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_resources"           ON website.resources              FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "ws_public_read_team"                ON website.team_members           FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "ws_public_read_testimonials"        ON website.testimonials           FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "ws_public_read_faq_cats"            ON website.faq_categories         FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "ws_public_read_faqs"                ON website.faqs                   FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "ws_public_read_metrics"             ON website.metrics                FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "ws_public_read_media"               ON website.media_assets           FOR SELECT TO anon, authenticated USING (true);

-- ── Anon INSERT policies (public forms) ──────────────────────────────────────

CREATE POLICY "ws_anon_contact_submit"   ON website.contact_inquiries      FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "ws_anon_booking_submit"   ON website.consultation_bookings  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "ws_anon_newsletter_sub"   ON website.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ── Super admin full access ───────────────────────────────────────────────────

CREATE POLICY "ws_super_admin_all_site_settings"       ON website.site_settings          FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_media"               ON website.media_assets           FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_nav"                 ON website.navigation_items       FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_tech_cats"           ON website.technology_categories  FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_tech"                ON website.technologies           FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_layers"              ON website.platform_layers        FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_layer_tools"         ON website.platform_layer_tools   FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_services"            ON website.services               FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_svc_caps"            ON website.service_capabilities   FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_svc_tech"            ON website.service_technologies   FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_industries"          ON website.industries             FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_ind_challenges"      ON website.industry_challenges    FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_ind_solutions"       ON website.industry_solutions     FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_ind_outcomes"        ON website.industry_outcomes      FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_ind_tech"            ON website.industry_technologies  FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_case_studies"        ON website.case_studies           FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_cs_kpis"             ON website.case_study_kpis        FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_cs_tech"             ON website.case_study_technologies FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_blog_cats"           ON website.blog_categories        FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_blog_tags"           ON website.blog_tags              FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_blog_posts"          ON website.blog_posts             FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_blog_post_tags"      ON website.blog_post_tags         FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_resources"           ON website.resources              FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_team"                ON website.team_members           FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_testimonials"        ON website.testimonials           FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_faq_cats"            ON website.faq_categories         FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_faqs"                ON website.faqs                   FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_metrics"             ON website.metrics                FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_contact"             ON website.contact_inquiries      FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_bookings"            ON website.consultation_bookings  FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "ws_super_admin_all_newsletter"          ON website.newsletter_subscribers FOR ALL TO authenticated USING (public.is_super_admin());

-- ── Service role bypass ───────────────────────────────────────────────────────
GRANT ALL ON ALL TABLES IN SCHEMA website TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA website TO service_role;

-- ============================================================================
-- STORAGE BUCKET  –  website media
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'website',
  'website',
  true,
  52428800,   -- 50 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','application/pdf']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "website_bucket_public_read" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'website');

CREATE POLICY "website_bucket_admin_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'website' AND public.is_super_admin());

CREATE POLICY "website_bucket_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'website' AND public.is_super_admin());

-- ============================================================================
-- HELPER VIEW  –  published blog posts with author & category
-- ============================================================================
CREATE OR REPLACE VIEW website.v_blog_posts_published AS
SELECT
  bp.id,
  bp.slug,
  bp.title,
  bp.excerpt,
  bp.content,
  bp.cover_image_url,
  bp.reading_time_min,
  bp.published_at,
  bp.view_count,
  bp.seo_title,
  bp.seo_description,
  bp.og_image_url,
  bc.name        AS category_name,
  bc.slug        AS category_slug,
  bc.color_hex   AS category_color,
  COALESCE(bp.author_name, p.full_name)   AS author_name,
  COALESCE(bp.author_avatar, p.avatar_url) AS author_avatar
FROM website.blog_posts bp
LEFT JOIN website.blog_categories bc ON bc.id = bp.category_id
LEFT JOIN public.profiles p ON p.id = bp.author_id
WHERE bp.is_published = true
ORDER BY bp.published_at DESC;

GRANT SELECT ON website.v_blog_posts_published TO anon, authenticated;
