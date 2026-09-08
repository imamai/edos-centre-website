-- Tracks whether an automatic reminder email has already gone out for an invoice,
-- so the daily automation sweep never re-sends the same reminder on every run.
alter table edoscentreadmin_invoices
  add column if not exists reminder_sent_at timestamptz,
  add column if not exists overdue_notice_sent_at timestamptz;
