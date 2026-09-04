import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

// RLS (migration 017) scopes every one of these queries to the caller's own
// client_id automatically — no client_id filter needed in application code,
// and none would help anyway (a portal user literally cannot read another
// client's rows no matter what this code asks for).

export type MyInvoice = Database["public"]["Tables"]["edoscentreadmin_invoices"]["Row"] & {
  edoscentreadmin_websites: { name: string } | null;
};

export async function getMyInvoices(): Promise<MyInvoice[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentreadmin_invoices")
    .select("*, edoscentreadmin_websites(name)")
    .order("issue_date", { ascending: false });
  return (data ?? []) as unknown as MyInvoice[];
}

export type MyPayment = Database["public"]["Tables"]["edoscentreadmin_payments"]["Row"] & {
  edoscentreadmin_invoices: { invoice_number: string } | null;
};

export async function getMyPayments(): Promise<MyPayment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentreadmin_payments")
    .select("*, edoscentreadmin_invoices(invoice_number)")
    .order("payment_date", { ascending: false });
  return (data ?? []) as unknown as MyPayment[];
}

export type MySubscription = Database["public"]["Tables"]["edoscentreadmin_subscriptions"]["Row"] & {
  edoscentreadmin_websites: { name: string; slug: string; status: string } | null;
  edoscentreadmin_subscription_plans: { name: string } | null;
};

export async function getMySubscriptions(): Promise<MySubscription[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentreadmin_subscriptions")
    .select("*, edoscentreadmin_websites(name, slug, status), edoscentreadmin_subscription_plans(name)")
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as MySubscription[];
}
