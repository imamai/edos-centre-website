-- ============================================================================
-- Migration 020 – Industry metrics (Phase 11b: wiring the public site to CMS)
-- ============================================================================
-- Industries had challenges/solutions/outcomes/technologies sub-tables but no
-- home for the 3 "key metrics" shown at the top of each industry detail page
-- (e.g. "200+ Facilities Connected"). Mirrors edoscentre_case_study_kpis'
-- metric_label/metric_value naming, minus metric_unit since these values
-- already embed their own suffix (e.g. "200+", "4.2M", "80%").
-- ============================================================================

CREATE TABLE IF NOT EXISTS edoscentre_industry_metrics (
  id           UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry_id  UUID    NOT NULL REFERENCES edoscentre_industries(id) ON DELETE CASCADE,
  metric_label TEXT    NOT NULL,
  metric_value TEXT    NOT NULL,
  sort_order   INT     NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_edoscentre_industry_metrics_industry ON edoscentre_industry_metrics (industry_id);

ALTER TABLE edoscentre_industry_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS eca_industry_metrics_public_read ON edoscentre_industry_metrics;
CREATE POLICY eca_industry_metrics_public_read ON edoscentre_industry_metrics
  FOR SELECT USING (true);

DROP POLICY IF EXISTS eca_admin_write ON edoscentre_industry_metrics;
CREATE POLICY eca_admin_write ON edoscentre_industry_metrics
  FOR ALL USING (edoscentreadmin_is_admin()) WITH CHECK (edoscentreadmin_is_admin());
