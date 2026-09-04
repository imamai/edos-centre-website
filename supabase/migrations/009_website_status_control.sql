-- ============================================================================
-- Migration 009 – Website suspend / activate / maintenance mode
-- ============================================================================
-- Adds the fields needed to actually enforce edoscentreadmin_websites.status on
-- the public site (suspension reason/message, maintenance message + return time,
-- who changed status and when) so status changes are auditable and the public
-- site can render a real suspension/maintenance page instead of just flipping
-- an enum with no consequence.
-- ============================================================================

ALTER TABLE edoscentreadmin_websites
  ADD COLUMN IF NOT EXISTS status_reason TEXT,
  ADD COLUMN IF NOT EXISTS status_message TEXT,
  ADD COLUMN IF NOT EXISTS maintenance_return_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS status_changed_by UUID REFERENCES edoscentreadmin_admin_users(id) ON DELETE SET NULL;
