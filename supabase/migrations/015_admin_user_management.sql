-- ============================================================================
-- Migration 015 – Admin user management + privilege-escalation guard (Phase 8)
-- ============================================================================
-- Two things:
--
-- 1. A dedicated edoscentreadmin_is_super_admin() check, distinct from
--    edoscentreadmin_is_admin(). The latter also returns true for a
--    website_admin/content_editor scoped to the given website (defaulting to
--    'edos-centre'), which migration 008 used for the admin_users/audit_logs
--    policies too — meaning any editor assigned to edos-centre could read the
--    full admin_users table (every admin's email/role) and the full audit log,
--    despite migration 008's own comments saying "only super_admin". This
--    migration makes those policies match their stated intent.
--
-- 2. A BEFORE UPDATE trigger closing a real privilege-escalation path: the
--    existing self-update RLS policy on edoscentreadmin_admin_users lets a
--    signed-in admin update their own row (so they can edit their own name),
--    but nothing stopped them from also PATCHing role/is_active/
--    must_change_password on that same row via a direct REST call — i.e.
--    promoting themselves to super_admin. The trigger blocks changes to those
--    three columns unless the caller is already a super_admin or the request
--    is running as service_role (our own server actions, which already
--    enforce authorization in application code before using that client).
-- ============================================================================

CREATE OR REPLACE FUNCTION edoscentreadmin_is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM edoscentreadmin_admin_users au
    WHERE au.id = auth.uid() AND au.is_active AND au.role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION edoscentreadmin_prevent_self_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' OR edoscentreadmin_is_super_admin() THEN
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role
     OR NEW.is_active IS DISTINCT FROM OLD.is_active
     OR NEW.must_change_password IS DISTINCT FROM OLD.must_change_password THEN
    RAISE EXCEPTION 'Only a super admin can change role, active status, or password-change requirement.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_edoscentreadmin_admin_users_guard ON edoscentreadmin_admin_users;
CREATE TRIGGER trg_edoscentreadmin_admin_users_guard
  BEFORE UPDATE ON edoscentreadmin_admin_users
  FOR EACH ROW EXECUTE FUNCTION edoscentreadmin_prevent_self_privilege_escalation();

-- Tighten policies that migration 008 documented as "super_admin only" but
-- implemented with the broader edoscentreadmin_is_admin().
DROP POLICY IF EXISTS eca_admin_users_self_read ON edoscentreadmin_admin_users;
CREATE POLICY eca_admin_users_self_read ON edoscentreadmin_admin_users
  FOR SELECT USING (id = auth.uid() OR edoscentreadmin_is_super_admin());

DROP POLICY IF EXISTS eca_admin_users_self_update ON edoscentreadmin_admin_users;
CREATE POLICY eca_admin_users_self_update ON edoscentreadmin_admin_users
  FOR UPDATE USING (id = auth.uid() OR edoscentreadmin_is_super_admin())
  WITH CHECK (id = auth.uid() OR edoscentreadmin_is_super_admin());

DROP POLICY IF EXISTS eca_admin_users_super_admin_write ON edoscentreadmin_admin_users;
CREATE POLICY eca_admin_users_super_admin_write ON edoscentreadmin_admin_users
  FOR INSERT WITH CHECK (edoscentreadmin_is_super_admin());

DROP POLICY IF EXISTS eca_admin_users_super_admin_delete ON edoscentreadmin_admin_users;
CREATE POLICY eca_admin_users_super_admin_delete ON edoscentreadmin_admin_users
  FOR DELETE USING (edoscentreadmin_is_super_admin());

DROP POLICY IF EXISTS eca_admin_user_websites_write ON edoscentreadmin_admin_user_websites;
CREATE POLICY eca_admin_user_websites_write ON edoscentreadmin_admin_user_websites
  FOR ALL USING (edoscentreadmin_is_super_admin()) WITH CHECK (edoscentreadmin_is_super_admin());

DROP POLICY IF EXISTS eca_audit_logs_super_admin_read ON edoscentreadmin_audit_logs;
CREATE POLICY eca_audit_logs_super_admin_read ON edoscentreadmin_audit_logs
  FOR SELECT USING (edoscentreadmin_is_super_admin());
