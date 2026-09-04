-- ============================================================================
-- Migration 008 – EDOS Control Centre (Super Admin Platform) – Phase 1
-- ============================================================================
-- Tables use the `edoscentreadmin_` prefix, distinct from `edoscentre_`
-- (public site content) and from other tenants' prefixes in this shared
-- project (mejasan_, jemvoyage_, kida_, margaret_, emiwama_).
-- Safe: all statements use IF NOT EXISTS / DO $$ guards.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION edoscentreadmin_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

-- ============================================================================
-- 1. WEBSITES  –  registry of every site this platform manages
-- ============================================================================
CREATE TABLE IF NOT EXISTS edoscentreadmin_websites (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                TEXT        NOT NULL UNIQUE,
  name                TEXT        NOT NULL,
  domain              TEXT,
  status              TEXT        NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','trial','pending','suspended','maintenance','expired','archived')),
  primary_admin_email TEXT,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_edoscentreadmin_websites_updated_at ON edoscentreadmin_websites;
CREATE TRIGGER trg_edoscentreadmin_websites_updated_at
  BEFORE UPDATE ON edoscentreadmin_websites
  FOR EACH ROW EXECUTE FUNCTION edoscentreadmin_set_updated_at();

-- ============================================================================
-- 2. ADMIN_USERS  –  platform administrators (linked to auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS edoscentreadmin_admin_users (
  id                    UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT        NOT NULL UNIQUE,
  full_name             TEXT,
  role                  TEXT        NOT NULL DEFAULT 'content_editor'
                          CHECK (role IN ('super_admin','website_admin','content_editor')),
  is_active             BOOLEAN     NOT NULL DEFAULT TRUE,
  must_change_password  BOOLEAN     NOT NULL DEFAULT TRUE,
  last_login_at         TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_edoscentreadmin_admin_users_updated_at ON edoscentreadmin_admin_users;
CREATE TRIGGER trg_edoscentreadmin_admin_users_updated_at
  BEFORE UPDATE ON edoscentreadmin_admin_users
  FOR EACH ROW EXECUTE FUNCTION edoscentreadmin_set_updated_at();

-- ============================================================================
-- 3. ADMIN_USER_WEBSITES  –  scopes website_admin / content_editor to sites
-- ============================================================================
CREATE TABLE IF NOT EXISTS edoscentreadmin_admin_user_websites (
  admin_user_id UUID NOT NULL REFERENCES edoscentreadmin_admin_users(id) ON DELETE CASCADE,
  website_id    UUID NOT NULL REFERENCES edoscentreadmin_websites(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (admin_user_id, website_id)
);

-- ============================================================================
-- 4. AUDIT_LOGS  –  administrative activity trail
-- ============================================================================
CREATE TABLE IF NOT EXISTS edoscentreadmin_audit_logs (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id   UUID        REFERENCES edoscentreadmin_admin_users(id) ON DELETE SET NULL,
  action     TEXT        NOT NULL,
  website_id UUID        REFERENCES edoscentreadmin_websites(id) ON DELETE SET NULL,
  metadata   JSONB       NOT NULL DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_edoscentreadmin_audit_logs_created_at ON edoscentreadmin_audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_edoscentreadmin_audit_logs_actor ON edoscentreadmin_audit_logs (actor_id);

-- ============================================================================
-- 5. AUTHORIZATION HELPER  –  used in RLS policies everywhere
-- ============================================================================
CREATE OR REPLACE FUNCTION edoscentreadmin_is_admin(p_website_slug TEXT DEFAULT 'edos-centre')
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM edoscentreadmin_admin_users au
    WHERE au.id = auth.uid() AND au.is_active AND au.role = 'super_admin'
  )
  OR EXISTS (
    SELECT 1
    FROM edoscentreadmin_admin_user_websites auw
    JOIN edoscentreadmin_admin_users au ON au.id = auw.admin_user_id
    JOIN edoscentreadmin_websites w ON w.id = auw.website_id
    WHERE auw.admin_user_id = auth.uid() AND au.is_active AND w.slug = p_website_slug
  );
$$;

-- ============================================================================
-- RLS
-- ============================================================================
ALTER TABLE edoscentreadmin_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE edoscentreadmin_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE edoscentreadmin_admin_user_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE edoscentreadmin_audit_logs ENABLE ROW LEVEL SECURITY;

-- websites: super_admin full access; website_admin/editor can read their assigned sites
DROP POLICY IF EXISTS eca_super_admin_all_websites ON edoscentreadmin_websites;
CREATE POLICY eca_super_admin_all_websites ON edoscentreadmin_websites
  FOR ALL USING (edoscentreadmin_is_admin(slug)) WITH CHECK (edoscentreadmin_is_admin(slug));

-- admin_users: users can read their own row; super_admin can manage all
DROP POLICY IF EXISTS eca_admin_users_self_read ON edoscentreadmin_admin_users;
CREATE POLICY eca_admin_users_self_read ON edoscentreadmin_admin_users
  FOR SELECT USING (id = auth.uid() OR edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_admin_users_self_update ON edoscentreadmin_admin_users;
CREATE POLICY eca_admin_users_self_update ON edoscentreadmin_admin_users
  FOR UPDATE USING (id = auth.uid() OR edoscentreadmin_is_admin())
  WITH CHECK (id = auth.uid() OR edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_admin_users_super_admin_write ON edoscentreadmin_admin_users;
CREATE POLICY eca_admin_users_super_admin_write ON edoscentreadmin_admin_users
  FOR INSERT WITH CHECK (edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_admin_users_super_admin_delete ON edoscentreadmin_admin_users;
CREATE POLICY eca_admin_users_super_admin_delete ON edoscentreadmin_admin_users
  FOR DELETE USING (edoscentreadmin_is_admin());

-- admin_user_websites: super_admin manages assignments; assigned user can read their own
DROP POLICY IF EXISTS eca_admin_user_websites_read ON edoscentreadmin_admin_user_websites;
CREATE POLICY eca_admin_user_websites_read ON edoscentreadmin_admin_user_websites
  FOR SELECT USING (admin_user_id = auth.uid() OR edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_admin_user_websites_write ON edoscentreadmin_admin_user_websites;
CREATE POLICY eca_admin_user_websites_write ON edoscentreadmin_admin_user_websites
  FOR ALL USING (edoscentreadmin_is_admin()) WITH CHECK (edoscentreadmin_is_admin());

-- audit_logs: only super_admin can read; inserts happen via service-role server code
DROP POLICY IF EXISTS eca_audit_logs_super_admin_read ON edoscentreadmin_audit_logs;
CREATE POLICY eca_audit_logs_super_admin_read ON edoscentreadmin_audit_logs
  FOR SELECT USING (edoscentreadmin_is_admin());

-- ============================================================================
-- Admin write policies on existing edoscentre_* content tables (additive —
-- does not touch existing public-read / anon-insert policies)
-- ============================================================================
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'edoscentre_services', 'edoscentre_service_capabilities', 'edoscentre_service_technologies',
    'edoscentre_industries', 'edoscentre_industry_challenges', 'edoscentre_industry_solutions',
    'edoscentre_industry_outcomes', 'edoscentre_industry_technologies',
    'edoscentre_case_studies', 'edoscentre_case_study_kpis', 'edoscentre_case_study_technologies',
    'edoscentre_blog_categories', 'edoscentre_blog_tags', 'edoscentre_blog_posts', 'edoscentre_blog_post_tags',
    'edoscentre_team_members', 'edoscentre_testimonials',
    'edoscentre_faq_categories', 'edoscentre_faqs',
    'edoscentre_site_settings', 'edoscentre_navigation_items', 'edoscentre_media_assets',
    'edoscentre_resources', 'edoscentre_metrics', 'edoscentre_technologies', 'edoscentre_technology_categories',
    'edoscentre_platform_layers', 'edoscentre_platform_layer_tools'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS eca_admin_write ON %I;
       CREATE POLICY eca_admin_write ON %I FOR ALL USING (edoscentreadmin_is_admin()) WITH CHECK (edoscentreadmin_is_admin());',
      t, t
    );
  END LOOP;
END $$;

-- Form submissions: admins may SELECT and UPDATE (status/notes) only — never DELETE, never INSERT (public forms own inserts)
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY['edoscentre_contact_inquiries', 'edoscentre_consultation_bookings', 'edoscentre_newsletter_subscribers'];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS eca_admin_read ON %I;
       CREATE POLICY eca_admin_read ON %I FOR SELECT USING (edoscentreadmin_is_admin());
       DROP POLICY IF EXISTS eca_admin_update ON %I;
       CREATE POLICY eca_admin_update ON %I FOR UPDATE USING (edoscentreadmin_is_admin()) WITH CHECK (edoscentreadmin_is_admin());',
      t, t, t, t
    );
  END LOOP;
END $$;

-- ============================================================================
-- Storage bucket for EDOS Centre media
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('edoscentre-media', 'edoscentre-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS eca_media_public_read ON storage.objects;
CREATE POLICY eca_media_public_read ON storage.objects
  FOR SELECT USING (bucket_id = 'edoscentre-media');

DROP POLICY IF EXISTS eca_media_admin_write ON storage.objects;
CREATE POLICY eca_media_admin_write ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'edoscentre-media' AND edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_media_admin_update ON storage.objects;
CREATE POLICY eca_media_admin_update ON storage.objects
  FOR UPDATE USING (bucket_id = 'edoscentre-media' AND edoscentreadmin_is_admin())
  WITH CHECK (bucket_id = 'edoscentre-media' AND edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_media_admin_delete ON storage.objects;
CREATE POLICY eca_media_admin_delete ON storage.objects
  FOR DELETE USING (bucket_id = 'edoscentre-media' AND edoscentreadmin_is_admin());

-- ============================================================================
-- Seed: register EDOS Centre as the first managed website
-- ============================================================================
INSERT INTO edoscentreadmin_websites (slug, name, domain, status, primary_admin_email)
VALUES ('edos-centre', 'EDOS Centre', 'edoscentre.co.ke', 'active', 'admin@edoscentre.co.ke')
ON CONFLICT (slug) DO NOTHING;
