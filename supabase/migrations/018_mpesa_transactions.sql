-- ============================================================================
-- Migration 018 – M-Pesa STK Push transactions (Phase 10)
-- ============================================================================
-- Tracks every Lipa Na M-Pesa Online (STK Push) request an admin triggers
-- against an invoice, from initiation through the Daraja callback. Admin-only
-- — the client portal stays view-only; payment is always admin-initiated for
-- now (the admin enters/confirms the client's phone number and sends the
-- prompt from the invoice screen).
-- ============================================================================

CREATE TABLE IF NOT EXISTS edoscentreadmin_mpesa_transactions (
  id                    UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id            UUID        NOT NULL REFERENCES edoscentreadmin_invoices(id) ON DELETE CASCADE,
  phone_number          TEXT        NOT NULL,
  amount                NUMERIC(12,2) NOT NULL,
  merchant_request_id   TEXT,
  checkout_request_id   TEXT        UNIQUE,
  status                TEXT        NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','completed','failed','cancelled')),
  result_code           TEXT,
  result_desc           TEXT,
  mpesa_receipt_number  TEXT,
  transaction_date      TIMESTAMPTZ,
  payment_id            UUID        REFERENCES edoscentreadmin_payments(id) ON DELETE SET NULL,
  initiated_by          UUID        REFERENCES edoscentreadmin_admin_users(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_edoscentreadmin_mpesa_transactions_invoice ON edoscentreadmin_mpesa_transactions (invoice_id);

DROP TRIGGER IF EXISTS trg_edoscentreadmin_mpesa_transactions_updated_at ON edoscentreadmin_mpesa_transactions;
CREATE TRIGGER trg_edoscentreadmin_mpesa_transactions_updated_at
  BEFORE UPDATE ON edoscentreadmin_mpesa_transactions
  FOR EACH ROW EXECUTE FUNCTION edoscentreadmin_set_updated_at();

ALTER TABLE edoscentreadmin_mpesa_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS eca_mpesa_transactions_admin_all ON edoscentreadmin_mpesa_transactions;
CREATE POLICY eca_mpesa_transactions_admin_all ON edoscentreadmin_mpesa_transactions
  FOR ALL USING (edoscentreadmin_is_admin()) WITH CHECK (edoscentreadmin_is_admin());
-- No policy for portal users: the Daraja callback is written by the service-role
-- client (bypasses RLS entirely), and clients never need to see raw M-Pesa
-- transaction rows — only the resulting payment, which they already can via
-- the existing eca_payments_portal_read policy (migration 017) once completed.
