-- ============================================================================
-- Migration 010 – Billing & Subscriptions (Phase 4)
-- ============================================================================
-- Clients, subscription plans, subscriptions, invoices, payments. All admin-only
-- (edoscentreadmin_ prefix, edoscentreadmin_is_admin() RLS, same pattern as
-- migration 008/009). No public access to any of these tables.
-- ============================================================================

-- ============================================================================
-- 1. CLIENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS edoscentreadmin_clients (
  id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name   TEXT        NOT NULL,
  contact_person TEXT,
  email          TEXT,
  phone          TEXT,
  address        TEXT,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_edoscentreadmin_clients_updated_at ON edoscentreadmin_clients;
CREATE TRIGGER trg_edoscentreadmin_clients_updated_at
  BEFORE UPDATE ON edoscentreadmin_clients
  FOR EACH ROW EXECUTE FUNCTION edoscentreadmin_set_updated_at();

-- ============================================================================
-- 2. SUBSCRIPTION PLANS
-- ============================================================================
CREATE TABLE IF NOT EXISTS edoscentreadmin_subscription_plans (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT        NOT NULL,
  description       TEXT,
  monthly_price     NUMERIC(12,2),
  quarterly_price   NUMERIC(12,2),
  semiannual_price  NUMERIC(12,2),
  annual_price      NUMERIC(12,2),
  setup_fee         NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency          TEXT        NOT NULL DEFAULT 'KES',
  features          TEXT,
  is_active         BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order        INT         NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_edoscentreadmin_subscription_plans_updated_at ON edoscentreadmin_subscription_plans;
CREATE TRIGGER trg_edoscentreadmin_subscription_plans_updated_at
  BEFORE UPDATE ON edoscentreadmin_subscription_plans
  FOR EACH ROW EXECUTE FUNCTION edoscentreadmin_set_updated_at();

-- ============================================================================
-- 3. SUBSCRIPTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS edoscentreadmin_subscriptions (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id        UUID        NOT NULL REFERENCES edoscentreadmin_websites(id) ON DELETE CASCADE,
  client_id         UUID        NOT NULL REFERENCES edoscentreadmin_clients(id) ON DELETE RESTRICT,
  plan_id           UUID        REFERENCES edoscentreadmin_subscription_plans(id) ON DELETE SET NULL,
  billing_cycle     TEXT        NOT NULL DEFAULT 'monthly'
                      CHECK (billing_cycle IN ('monthly','quarterly','semiannual','annual','custom')),
  amount            NUMERIC(12,2) NOT NULL,
  currency          TEXT        NOT NULL DEFAULT 'KES',
  status            TEXT        NOT NULL DEFAULT 'trial'
                      CHECK (status IN ('trial','active','due_soon','grace_period','overdue','suspended','cancelled','expired')),
  start_date        DATE        NOT NULL DEFAULT CURRENT_DATE,
  renewal_date      DATE,
  grace_period_days INT         NOT NULL DEFAULT 7,
  auto_renew        BOOLEAN     NOT NULL DEFAULT TRUE,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_edoscentreadmin_subscriptions_website ON edoscentreadmin_subscriptions (website_id);
CREATE INDEX IF NOT EXISTS idx_edoscentreadmin_subscriptions_client ON edoscentreadmin_subscriptions (client_id);

DROP TRIGGER IF EXISTS trg_edoscentreadmin_subscriptions_updated_at ON edoscentreadmin_subscriptions;
CREATE TRIGGER trg_edoscentreadmin_subscriptions_updated_at
  BEFORE UPDATE ON edoscentreadmin_subscriptions
  FOR EACH ROW EXECUTE FUNCTION edoscentreadmin_set_updated_at();

-- ============================================================================
-- 4. INVOICES  (invoice_number generated app-side as INV-{year}-{seq})
-- ============================================================================
CREATE SEQUENCE IF NOT EXISTS edoscentreadmin_invoice_seq START 1;

CREATE TABLE IF NOT EXISTS edoscentreadmin_invoices (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number  TEXT        NOT NULL UNIQUE,
  client_id       UUID        NOT NULL REFERENCES edoscentreadmin_clients(id) ON DELETE RESTRICT,
  website_id      UUID        REFERENCES edoscentreadmin_websites(id) ON DELETE SET NULL,
  subscription_id UUID        REFERENCES edoscentreadmin_subscriptions(id) ON DELETE SET NULL,
  issue_date      DATE        NOT NULL DEFAULT CURRENT_DATE,
  due_date        DATE        NOT NULL,
  amount          NUMERIC(12,2) NOT NULL,
  tax             NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount        NUMERIC(12,2) NOT NULL DEFAULT 0,
  total           NUMERIC(12,2) NOT NULL,
  currency        TEXT        NOT NULL DEFAULT 'KES',
  status          TEXT        NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','sent','pending','paid','partially_paid','overdue','cancelled')),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_edoscentreadmin_invoices_client ON edoscentreadmin_invoices (client_id);
CREATE INDEX IF NOT EXISTS idx_edoscentreadmin_invoices_status ON edoscentreadmin_invoices (status);

DROP TRIGGER IF EXISTS trg_edoscentreadmin_invoices_updated_at ON edoscentreadmin_invoices;
CREATE TRIGGER trg_edoscentreadmin_invoices_updated_at
  BEFORE UPDATE ON edoscentreadmin_invoices
  FOR EACH ROW EXECUTE FUNCTION edoscentreadmin_set_updated_at();

-- ============================================================================
-- 5. PAYMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS edoscentreadmin_payments (
  id                    UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id            UUID        NOT NULL REFERENCES edoscentreadmin_invoices(id) ON DELETE CASCADE,
  amount                NUMERIC(12,2) NOT NULL,
  currency              TEXT        NOT NULL DEFAULT 'KES',
  payment_method        TEXT        NOT NULL DEFAULT 'bank'
                          CHECK (payment_method IN ('mpesa','bank','card','paypal','cash','other')),
  transaction_reference TEXT,
  payment_date          DATE        NOT NULL DEFAULT CURRENT_DATE,
  status                TEXT        NOT NULL DEFAULT 'completed'
                          CHECK (status IN ('pending','completed','failed','refunded','cancelled')),
  notes                 TEXT,
  recorded_by           UUID        REFERENCES edoscentreadmin_admin_users(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_edoscentreadmin_payments_invoice ON edoscentreadmin_payments (invoice_id);

-- ============================================================================
-- RLS — admin-only across the board (super_admin, or website_admin/editor scoped
-- to the subscription's/invoice's/payment's website via the same helper used
-- everywhere else)
-- ============================================================================
ALTER TABLE edoscentreadmin_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE edoscentreadmin_subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE edoscentreadmin_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE edoscentreadmin_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE edoscentreadmin_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS eca_clients_admin_all ON edoscentreadmin_clients;
CREATE POLICY eca_clients_admin_all ON edoscentreadmin_clients
  FOR ALL USING (edoscentreadmin_is_admin()) WITH CHECK (edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_plans_admin_all ON edoscentreadmin_subscription_plans;
CREATE POLICY eca_plans_admin_all ON edoscentreadmin_subscription_plans
  FOR ALL USING (edoscentreadmin_is_admin()) WITH CHECK (edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_subscriptions_admin_all ON edoscentreadmin_subscriptions;
CREATE POLICY eca_subscriptions_admin_all ON edoscentreadmin_subscriptions
  FOR ALL USING (edoscentreadmin_is_admin()) WITH CHECK (edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_invoices_admin_all ON edoscentreadmin_invoices;
CREATE POLICY eca_invoices_admin_all ON edoscentreadmin_invoices
  FOR ALL USING (edoscentreadmin_is_admin()) WITH CHECK (edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_payments_admin_all ON edoscentreadmin_payments;
CREATE POLICY eca_payments_admin_all ON edoscentreadmin_payments
  FOR ALL USING (edoscentreadmin_is_admin()) WITH CHECK (edoscentreadmin_is_admin());
