-- ============================================================================
-- Migration 017 – Client Portal (Phase 9)
-- ============================================================================
-- A client-facing login, separate from the admin platform, scoped to exactly
-- one edoscentreadmin_clients row. View-only for now: their own invoices,
-- payment history, subscriptions, and the status of the website(s) tied to
-- those subscriptions. No payment action yet (that's the M-Pesa phase).
--
-- One client company can have more than one portal login (e.g. a finance
-- contact and a technical contact), so this is its own table rather than an
-- auth flag on edoscentreadmin_clients — same reasoning as admin_users being
-- separate from the websites they can access.
-- ============================================================================

CREATE TABLE IF NOT EXISTS edoscentreadmin_client_portal_users (
  id                    UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id             UUID        NOT NULL REFERENCES edoscentreadmin_clients(id) ON DELETE CASCADE,
  email                 TEXT        NOT NULL UNIQUE,
  full_name             TEXT,
  is_active             BOOLEAN     NOT NULL DEFAULT TRUE,
  must_change_password  BOOLEAN     NOT NULL DEFAULT TRUE,
  last_login_at         TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_edoscentreadmin_client_portal_users_client ON edoscentreadmin_client_portal_users (client_id);

DROP TRIGGER IF EXISTS trg_edoscentreadmin_client_portal_users_updated_at ON edoscentreadmin_client_portal_users;
CREATE TRIGGER trg_edoscentreadmin_client_portal_users_updated_at
  BEFORE UPDATE ON edoscentreadmin_client_portal_users
  FOR EACH ROW EXECUTE FUNCTION edoscentreadmin_set_updated_at();

-- ============================================================================
-- Helper: the client_id of the currently authenticated portal user, or NULL
-- for anyone else (admins, anon, or an inactive portal account). SECURITY
-- DEFINER so it can read the table regardless of the caller's own RLS grants,
-- exactly like edoscentreadmin_is_admin().
-- ============================================================================
CREATE OR REPLACE FUNCTION edoscentreadmin_current_client_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT cpu.client_id FROM edoscentreadmin_client_portal_users cpu
  WHERE cpu.id = auth.uid() AND cpu.is_active
  LIMIT 1;
$$;

-- Same privilege-escalation guard as edoscentreadmin_admin_users (migration 015):
-- a portal user can update their own row (e.g. full_name) but not re-point it at
-- a different client, reactivate themselves, or clear must_change_password.
CREATE OR REPLACE FUNCTION edoscentreadmin_prevent_portal_self_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' OR edoscentreadmin_is_admin() THEN
    RETURN NEW;
  END IF;

  IF NEW.client_id IS DISTINCT FROM OLD.client_id
     OR NEW.is_active IS DISTINCT FROM OLD.is_active
     OR NEW.must_change_password IS DISTINCT FROM OLD.must_change_password THEN
    RAISE EXCEPTION 'Only an admin can change client assignment, active status, or password-change requirement.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_edoscentreadmin_client_portal_users_guard ON edoscentreadmin_client_portal_users;
CREATE TRIGGER trg_edoscentreadmin_client_portal_users_guard
  BEFORE UPDATE ON edoscentreadmin_client_portal_users
  FOR EACH ROW EXECUTE FUNCTION edoscentreadmin_prevent_portal_self_tampering();

-- ============================================================================
-- RLS: client_portal_users itself
-- ============================================================================
ALTER TABLE edoscentreadmin_client_portal_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS eca_portal_users_self_or_admin_read ON edoscentreadmin_client_portal_users;
CREATE POLICY eca_portal_users_self_or_admin_read ON edoscentreadmin_client_portal_users
  FOR SELECT USING (id = auth.uid() OR edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_portal_users_self_or_admin_update ON edoscentreadmin_client_portal_users;
CREATE POLICY eca_portal_users_self_or_admin_update ON edoscentreadmin_client_portal_users
  FOR UPDATE USING (id = auth.uid() OR edoscentreadmin_is_admin())
  WITH CHECK (id = auth.uid() OR edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_portal_users_admin_insert ON edoscentreadmin_client_portal_users;
CREATE POLICY eca_portal_users_admin_insert ON edoscentreadmin_client_portal_users
  FOR INSERT WITH CHECK (edoscentreadmin_is_admin());

DROP POLICY IF EXISTS eca_portal_users_admin_delete ON edoscentreadmin_client_portal_users;
CREATE POLICY eca_portal_users_admin_delete ON edoscentreadmin_client_portal_users
  FOR DELETE USING (edoscentreadmin_is_admin());

-- ============================================================================
-- Additive SELECT-only policies granting portal users read access to their own
-- data on tables that otherwise only admins can touch (FOR ALL admin policies
-- from migration 010 stay untouched — these are extra permissive policies,
-- not replacements, so admin access is unaffected).
-- ============================================================================
DROP POLICY IF EXISTS eca_invoices_portal_read ON edoscentreadmin_invoices;
CREATE POLICY eca_invoices_portal_read ON edoscentreadmin_invoices
  FOR SELECT USING (client_id = edoscentreadmin_current_client_id());

DROP POLICY IF EXISTS eca_subscriptions_portal_read ON edoscentreadmin_subscriptions;
CREATE POLICY eca_subscriptions_portal_read ON edoscentreadmin_subscriptions
  FOR SELECT USING (client_id = edoscentreadmin_current_client_id());

DROP POLICY IF EXISTS eca_payments_portal_read ON edoscentreadmin_payments;
CREATE POLICY eca_payments_portal_read ON edoscentreadmin_payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM edoscentreadmin_invoices i
      WHERE i.id = edoscentreadmin_payments.invoice_id
        AND i.client_id = edoscentreadmin_current_client_id()
    )
  );

DROP POLICY IF EXISTS eca_websites_portal_read ON edoscentreadmin_websites;
CREATE POLICY eca_websites_portal_read ON edoscentreadmin_websites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM edoscentreadmin_subscriptions s
      WHERE s.website_id = edoscentreadmin_websites.id
        AND s.client_id = edoscentreadmin_current_client_id()
    )
  );
