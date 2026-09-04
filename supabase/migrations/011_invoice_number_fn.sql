-- ============================================================================
-- Migration 011 – invoice number generator
-- ============================================================================
CREATE OR REPLACE FUNCTION edoscentreadmin_next_invoice_number()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'INV-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('edoscentreadmin_invoice_seq')::text, 4, '0');
$$;

GRANT EXECUTE ON FUNCTION edoscentreadmin_next_invoice_number() TO authenticated, service_role;
