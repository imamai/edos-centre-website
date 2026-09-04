-- ============================================================================
-- Migration 019 – Service outcomes (Phase 11: wiring the public site to CMS)
-- ============================================================================
-- edoscentre_services had no "outcomes" sub-entity, unlike industries
-- (edoscentre_industry_outcomes) — but the live services page shows an
-- "Expected Outcomes" list per service, so it needs the same editable shape.
-- ============================================================================

CREATE TABLE IF NOT EXISTS edoscentre_service_outcomes (
  id         UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID    NOT NULL REFERENCES edoscentre_services(id) ON DELETE CASCADE,
  outcome    TEXT    NOT NULL,
  sort_order INT     NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_edoscentre_service_outcomes_service ON edoscentre_service_outcomes (service_id);

ALTER TABLE edoscentre_service_outcomes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS eca_service_outcomes_public_read ON edoscentre_service_outcomes;
CREATE POLICY eca_service_outcomes_public_read ON edoscentre_service_outcomes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS eca_admin_write ON edoscentre_service_outcomes;
CREATE POLICY eca_admin_write ON edoscentre_service_outcomes
  FOR ALL USING (edoscentreadmin_is_admin()) WITH CHECK (edoscentreadmin_is_admin());
