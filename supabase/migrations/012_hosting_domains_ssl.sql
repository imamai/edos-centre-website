-- ============================================================================
-- Migration 012 – Hosting, Domains & SSL tracking (Phase 5)
-- ============================================================================
-- Per-website hosting account, one-or-many domains per website, one-or-many SSL
-- certificates per website (optionally tied to a specific domain). Admin-only
-- (edoscentreadmin_ prefix, edoscentreadmin_is_admin() RLS), same pattern as
-- migrations 008/009/010. No public access.
--
-- Expiry state (expiring soon / expired) is intentionally NOT stored as a column
-- here — it's derived from expiry_date at read time so it can never go stale.
-- The `status` columns instead capture manually-set lifecycle states only.
-- ============================================================================

-- ============================================================================
-- 1. HOSTING DETAILS (one per website)
-- ============================================================================
CREATE TABLE IF NOT EXISTS edoscentreadmin_hosting_details (
  id                 UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id         UUID        NOT NULL UNIQUE REFERENCES edoscentreadmin_websites(id) ON DELETE CASCADE,
  provider           TEXT        NOT NULL,
  plan               TEXT,
  server_ip          TEXT,
  control_panel_url  TEXT,
  storage_limit_gb   NUMERIC(10,2),
  bandwidth_limit_gb NUMERIC(10,2),
  renewal_date       DATE,
  cost               NUMERIC(12,2),
  currency           TEXT        NOT NULL DEFAULT 'KES',
  auto_renew         BOOLEAN     NOT NULL DEFAULT TRUE,
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_edoscentreadmin_hosting_details_updated_at ON edoscentreadmin_hosting_details;
CREATE TRIGGER trg_edoscentreadmin_hosting_details_updated_at
  BEFORE UPDATE ON edoscentreadmin_hosting_details
  FOR EACH ROW EXECUTE FUNCTION edoscentreadmin_set_updated_at();

-- ============================================================================
-- 2. DOMAINS (many per website)
-- ============================================================================
CREATE TABLE IF NOT EXISTS edoscentreadmin_domains (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id      UUID        NOT NULL REFERENCES edoscentreadmin_websites(id) ON DELETE CASCADE,
  domain_name     TEXT        NOT NULL,
  registrar       TEXT,
  registered_date DATE,
  expiry_date     DATE        NOT NULL,
  auto_renew      BOOLEAN     NOT NULL DEFAULT TRUE,
  nameservers     TEXT,
  cost            NUMERIC(12,2),
  currency        TEXT        NOT NULL DEFAULT 'KES',
  status          TEXT        NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','transferred_out','cancelled')),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_edoscentreadmin_domains_website ON edoscentreadmin_domains (website_id);
CREATE INDEX IF NOT EXISTS idx_edoscentreadmin_domains_expiry ON edoscentreadmin_domains (expiry_date);

DROP TRIGGER IF EXISTS trg_edoscentreadmin_domains_updated_at ON edoscentreadmin_domains;
CREATE TRIGGER trg_edoscentreadmin_domains_updated_at
  BEFORE UPDATE ON edoscentreadmin_domains
  FOR EACH ROW EXECUTE FUNCTION edoscentreadmin_set_updated_at();

-- ============================================================================
-- 3. SSL CERTIFICATES (many per website, optionally tied to one domain)
-- ============================================================================
CREATE TABLE IF NOT EXISTS edoscentreadmin_ssl_certificates (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id   UUID        NOT NULL REFERENCES edoscentreadmin_websites(id) ON DELETE CASCADE,
  domain_id    UUID        REFERENCES edoscentreadmin_domains(id) ON DELETE SET NULL,
  provider     TEXT        NOT NULL,
  cert_type    TEXT        NOT NULL DEFAULT 'free'
                 CHECK (cert_type IN ('free','paid','wildcard','ev')),
  issued_date  DATE,
  expiry_date  DATE        NOT NULL,
  auto_renew   BOOLEAN     NOT NULL DEFAULT TRUE,
  cost         NUMERIC(12,2),
  currency     TEXT        NOT NULL DEFAULT 'KES',
  status       TEXT        NOT NULL DEFAULT 'active'
                 CHECK (status IN ('active','revoked','expired')),
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_edoscentreadmin_ssl_website ON edoscentreadmin_ssl_certificates (website_id);
CREATE INDEX IF NOT EXISTS idx_edoscentreadmin_ssl_expiry ON edoscentreadmin_ssl_certificates (expiry_date);

DROP TRIGGER IF EXISTS trg_edoscentreadmin_ssl_certificates_updated_at ON edoscentreadmin_ssl_certificates;
CREATE TRIGGER trg_edoscentreadmin_ssl_certificates_updated_at
  BEFORE UPDATE ON edoscentreadmin_ssl_certificates
  FOR EACH ROW EXECUTE FUNCTION edoscentreadmin_set_updated_at();

-- ============================================================================
-- RLS — admin-only across the board
-- ============================================================================
ALTER TABLE edoscentreadmin_hosting_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE edoscentreadmin_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE edoscentreadmin_ssl_certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS eca_hosting_details_admin_all ON edoscentreadmin_hosting_details;
CREATE POLICY eca_hosting_details_admin_all ON edoscentreadmin_hosting_details
  FOR ALL USING (edoscentreadmin_is_admin()) WITH CHECK (edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_domains_admin_all ON edoscentreadmin_domains;
CREATE POLICY eca_domains_admin_all ON edoscentreadmin_domains
  FOR ALL USING (edoscentreadmin_is_admin()) WITH CHECK (edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_ssl_certificates_admin_all ON edoscentreadmin_ssl_certificates;
CREATE POLICY eca_ssl_certificates_admin_all ON edoscentreadmin_ssl_certificates
  FOR ALL USING (edoscentreadmin_is_admin()) WITH CHECK (edoscentreadmin_is_admin());
