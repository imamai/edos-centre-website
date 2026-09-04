-- ============================================================================
-- Migration 014 – Security hardening (Phase 8)
-- ============================================================================
-- Addresses Supabase security-advisor findings that are within this platform's
-- own scope (edoscentre_ / edoscentreadmin_ tables and functions). Findings on
-- other tenants sharing this project (mejasan_, kida_, margaret_, jemvoyage_,
-- and the generic legacy is_admin/handle_new_user/update_updated_at functions)
-- are deliberately left untouched — this project is shared multi-tenant infra
-- and altering another app's functions/extensions is out of scope and risks
-- breaking apps this codebase has no visibility into.
--
-- Deliberately NOT applied: revoking EXECUTE on edoscentreadmin_is_admin() from
-- anon/authenticated. The advisor flags it as publicly callable, but this
-- function is invoked from inside RLS USING/WITH CHECK clauses on nearly every
-- edoscentre_*/edoscentreadmin_* table — Postgres requires the querying role to
-- hold EXECUTE on any function referenced by a policy it's evaluating. Revoking
-- it would break RLS evaluation for anon (the public site) and authenticated
-- (logged-in admins) alike, not just close an RPC. Calling it directly via
-- /rest/v1/rpc/edoscentreadmin_is_admin only ever returns a boolean the caller
-- could otherwise infer from whether their own request succeeds, so it isn't a
-- meaningful information leak on its own.
-- ============================================================================

-- 1. Blog listing view: was SECURITY DEFINER (an ERROR-level finding), meaning
--    it read edoscentre_blog_posts/edoscentre_blog_categories with the view
--    owner's privileges rather than the querying role's. The view's own WHERE
--    clause already restricts it to is_published = true, so this was not an
--    active data leak, but SECURITY INVOKER is the correct, minimal-privilege
--    behavior and costs nothing here.
ALTER VIEW edoscentre_v_blog_posts_published SET (security_invoker = on);

-- 2. Trigger functions with a mutable search_path (a privilege-escalation
--    vector if a lower-privileged role could ever create objects earlier in
--    the resolution path). Pin it explicitly.
ALTER FUNCTION edoscentre_set_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION edoscentreadmin_set_updated_at() SET search_path = public, pg_temp;

-- 3. edoscentreadmin_next_invoice_number() is only ever called from
--    src/lib/admin/actions/invoice-actions.ts via the service-role client, not
--    from any user-session client, and it is not referenced by any RLS policy.
--    So unlike edoscentreadmin_is_admin(), anon/authenticated have no
--    legitimate need to call it — revoking closes an RPC that currently lets
--    any signed-in (or anonymous) caller burn sequence values and skip
--    invoice numbers, with no corresponding benefit.
REVOKE EXECUTE ON FUNCTION edoscentreadmin_next_invoice_number() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION edoscentreadmin_next_invoice_number() TO service_role, postgres;
