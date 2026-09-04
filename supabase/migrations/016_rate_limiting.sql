-- ============================================================================
-- Migration 016 – Rate limiting for public form endpoints (Phase 8)
-- ============================================================================
-- The three public POST routes (/api/contact, /api/consultation, /api/newsletter)
-- had no abuse protection — any script could hammer them. This adds a small
-- DB-backed sliding-window limiter, since serverless function instances don't
-- share in-memory state reliably. The upsert below is a single atomic
-- statement, so concurrent requests for the same key can't race past the limit.
-- ============================================================================

CREATE TABLE IF NOT EXISTS edoscentre_rate_limits (
  key          TEXT        PRIMARY KEY,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  count        INT         NOT NULL DEFAULT 1
);

CREATE OR REPLACE FUNCTION edoscentre_check_rate_limit(p_key TEXT, p_limit INT, p_window_seconds INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
BEGIN
  INSERT INTO edoscentre_rate_limits (key, window_start, count)
  VALUES (p_key, NOW(), 1)
  ON CONFLICT (key) DO UPDATE SET
    count = CASE
      WHEN edoscentre_rate_limits.window_start < NOW() - (p_window_seconds || ' seconds')::interval THEN 1
      ELSE edoscentre_rate_limits.count + 1
    END,
    window_start = CASE
      WHEN edoscentre_rate_limits.window_start < NOW() - (p_window_seconds || ' seconds')::interval THEN NOW()
      ELSE edoscentre_rate_limits.window_start
    END
  RETURNING count INTO v_count;

  RETURN v_count <= p_limit;
END;
$$;

-- Only server-side (service-role) code should call this — never exposed to anon/authenticated.
REVOKE EXECUTE ON FUNCTION edoscentre_check_rate_limit(TEXT, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION edoscentre_check_rate_limit(TEXT, INT, INT) TO service_role, postgres;

ALTER TABLE edoscentre_rate_limits ENABLE ROW LEVEL SECURITY;
-- No policies granted: RLS with zero policies denies all access to anon/authenticated by
-- default; only the service role (which bypasses RLS) reads/writes this table.
