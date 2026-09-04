import "server-only";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Database } from "@/types/database.types";

export type AuditLogWithActor = Database["public"]["Tables"]["edoscentreadmin_audit_logs"]["Row"] & {
  edoscentreadmin_admin_users: { email: string; full_name: string | null } | null;
};

export async function getWebsites() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentreadmin_websites").select("*").order("created_at");
  return data ?? [];
}

export async function getWebsiteBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentreadmin_websites").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function getRecentAuditLogs(limit = 10): Promise<AuditLogWithActor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentreadmin_audit_logs")
    .select("*, edoscentreadmin_admin_users(email, full_name)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as AuditLogWithActor[];
}

export async function getTeamMembers() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentre_team_members").select("*").order("sort_order");
  return data ?? [];
}

export async function getTestimonialsAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentre_testimonials").select("*").order("sort_order");
  return data ?? [];
}

export type FaqWithCategory = Database["public"]["Tables"]["edoscentre_faqs"]["Row"] & {
  edoscentre_faq_categories: { id: string; name: string } | null;
};

export async function getFaqsAdmin(): Promise<FaqWithCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentre_faqs")
    .select("*, edoscentre_faq_categories(id, name)")
    .order("sort_order");
  return (data ?? []) as unknown as FaqWithCategory[];
}

export async function getFaqCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentre_faq_categories").select("*").order("sort_order");
  return data ?? [];
}

export async function getNavigationItemsAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentre_navigation_items").select("*").order("menu_slot").order("sort_order");
  return data ?? [];
}

export async function getIndustriesAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentre_industries").select("*").order("sort_order");
  return data ?? [];
}

export type ServiceWithRelations = Database["public"]["Tables"]["edoscentre_services"]["Row"] & {
  edoscentre_service_capabilities: Database["public"]["Tables"]["edoscentre_service_capabilities"]["Row"][];
  edoscentre_service_outcomes: Database["public"]["Tables"]["edoscentre_service_outcomes"]["Row"][];
  edoscentre_service_technologies: { technology_id: string }[];
};

export async function getServicesAdmin(): Promise<ServiceWithRelations[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentre_services")
    .select("*, edoscentre_service_capabilities(*), edoscentre_service_outcomes(*), edoscentre_service_technologies(technology_id)")
    .order("sort_order");
  return (data ?? []) as unknown as ServiceWithRelations[];
}

export type IndustryWithRelations = Database["public"]["Tables"]["edoscentre_industries"]["Row"] & {
  edoscentre_industry_challenges: Database["public"]["Tables"]["edoscentre_industry_challenges"]["Row"][];
  edoscentre_industry_solutions: Database["public"]["Tables"]["edoscentre_industry_solutions"]["Row"][];
  edoscentre_industry_outcomes: Database["public"]["Tables"]["edoscentre_industry_outcomes"]["Row"][];
  edoscentre_industry_metrics: Database["public"]["Tables"]["edoscentre_industry_metrics"]["Row"][];
  edoscentre_industry_technologies: { technology_id: string }[];
};

export async function getIndustriesAdminFull(): Promise<IndustryWithRelations[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentre_industries")
    .select(
      "*, edoscentre_industry_challenges(*), edoscentre_industry_solutions(*), edoscentre_industry_outcomes(*), edoscentre_industry_metrics(*), edoscentre_industry_technologies(technology_id)",
    )
    .order("sort_order");
  return (data ?? []) as unknown as IndustryWithRelations[];
}

export async function getMetricsAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentre_metrics").select("*").order("sort_order");
  return data ?? [];
}

export type PlatformLayerWithTools = Database["public"]["Tables"]["edoscentre_platform_layers"]["Row"] & {
  edoscentre_platform_layer_tools: Database["public"]["Tables"]["edoscentre_platform_layer_tools"]["Row"][];
};

export async function getPlatformLayersAdminFull(): Promise<PlatformLayerWithTools[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentre_platform_layers")
    .select("*, edoscentre_platform_layer_tools(*)")
    .order("layer_number");
  return (data ?? []) as unknown as PlatformLayerWithTools[];
}

export type CaseStudyWithRelations = Database["public"]["Tables"]["edoscentre_case_studies"]["Row"] & {
  edoscentre_case_study_kpis: Database["public"]["Tables"]["edoscentre_case_study_kpis"]["Row"][];
  edoscentre_case_study_technologies: { technology_id: string }[];
};

export async function getCaseStudiesAdmin(): Promise<CaseStudyWithRelations[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentre_case_studies")
    .select("*, edoscentre_case_study_kpis(*), edoscentre_case_study_technologies(technology_id)")
    .order("sort_order");
  return (data ?? []) as unknown as CaseStudyWithRelations[];
}

export type BlogPostWithRelations = Database["public"]["Tables"]["edoscentre_blog_posts"]["Row"] & {
  edoscentre_blog_categories: { id: string; name: string } | null;
  edoscentre_blog_post_tags: { tag_id: string }[];
};

export async function getBlogPostsAdmin(): Promise<BlogPostWithRelations[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentre_blog_posts")
    .select("*, edoscentre_blog_categories(id, name), edoscentre_blog_post_tags(tag_id)")
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as BlogPostWithRelations[];
}

export async function getBlogCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentre_blog_categories").select("*").order("sort_order");
  return data ?? [];
}

export async function getBlogTags() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentre_blog_tags").select("*").order("name");
  return data ?? [];
}

export async function getTechnologiesAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentre_technologies").select("*").order("name");
  return data ?? [];
}

export async function getMediaAssets() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentre_media_assets").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getFormSubmissions() {
  const supabase = await createClient();
  const [contact, consultation, newsletter] = await Promise.all([
    supabase.from("edoscentre_contact_inquiries").select("*").order("created_at", { ascending: false }),
    supabase.from("edoscentre_consultation_bookings").select("*").order("created_at", { ascending: false }),
    supabase.from("edoscentre_newsletter_subscribers").select("*").order("subscribed_at", { ascending: false }),
  ]);
  return {
    contact: contact.data ?? [],
    consultation: consultation.data ?? [],
    newsletter: newsletter.data ?? [],
  };
}

export async function getClients() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentreadmin_clients").select("*").order("company_name");
  return data ?? [];
}

export async function getClientPortalUsers() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentreadmin_client_portal_users").select("*").order("created_at");
  return data ?? [];
}

export async function getSubscriptionPlans() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentreadmin_subscription_plans").select("*").order("sort_order");
  return data ?? [];
}

export type SubscriptionWithRelations = Database["public"]["Tables"]["edoscentreadmin_subscriptions"]["Row"] & {
  edoscentreadmin_clients: { company_name: string } | null;
  edoscentreadmin_websites: { name: string; slug: string } | null;
  edoscentreadmin_subscription_plans: { name: string } | null;
};

export async function getSubscriptions(): Promise<SubscriptionWithRelations[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentreadmin_subscriptions")
    .select("*, edoscentreadmin_clients(company_name), edoscentreadmin_websites(name, slug), edoscentreadmin_subscription_plans(name)")
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as SubscriptionWithRelations[];
}

export type InvoiceWithRelations = Database["public"]["Tables"]["edoscentreadmin_invoices"]["Row"] & {
  edoscentreadmin_clients: { company_name: string } | null;
  edoscentreadmin_websites: { name: string } | null;
};

export async function getInvoices(): Promise<InvoiceWithRelations[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentreadmin_invoices")
    .select("*, edoscentreadmin_clients(company_name), edoscentreadmin_websites(name)")
    .order("issue_date", { ascending: false });
  return (data ?? []) as unknown as InvoiceWithRelations[];
}

export type PaymentWithRelations = Database["public"]["Tables"]["edoscentreadmin_payments"]["Row"] & {
  edoscentreadmin_invoices: { invoice_number: string; client_id: string } | null;
};

export async function getPayments(): Promise<PaymentWithRelations[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentreadmin_payments")
    .select("*, edoscentreadmin_invoices(invoice_number, client_id)")
    .order("payment_date", { ascending: false });
  return (data ?? []) as unknown as PaymentWithRelations[];
}

export async function getMpesaTransactions() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentreadmin_mpesa_transactions")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getBillingStats() {
  const supabase = await createClient();
  const [{ data: activeSubs }, { data: unpaidInvoices }, { data: paidThisMonth }] = await Promise.all([
    supabase.from("edoscentreadmin_subscriptions").select("amount, billing_cycle").eq("status", "active"),
    supabase.from("edoscentreadmin_invoices").select("total").in("status", ["pending", "sent", "overdue", "partially_paid"]),
    supabase
      .from("edoscentreadmin_payments")
      .select("amount")
      .eq("status", "completed")
      .gte("payment_date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)),
  ]);

  const MONTHLY_FACTOR: Record<string, number> = { monthly: 1, quarterly: 1 / 3, semiannual: 1 / 6, annual: 1 / 12, custom: 1 };
  const mrr = (activeSubs ?? []).reduce((sum, s) => sum + Number(s.amount) * (MONTHLY_FACTOR[s.billing_cycle] ?? 1), 0);
  const outstanding = (unpaidInvoices ?? []).reduce((sum, i) => sum + Number(i.total), 0);
  const revenueThisMonth = (paidThisMonth ?? []).reduce((sum, p) => sum + Number(p.amount), 0);

  return { mrr, outstanding, revenueThisMonth, arr: mrr * 12 };
}

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentre_site_settings").select("*").order("key");
  return data ?? [];
}

export type HostingDetailWithWebsite = Database["public"]["Tables"]["edoscentreadmin_hosting_details"]["Row"] & {
  edoscentreadmin_websites: { name: string; slug: string } | null;
};

export async function getHostingDetails(): Promise<HostingDetailWithWebsite[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentreadmin_hosting_details")
    .select("*, edoscentreadmin_websites(name, slug)")
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as HostingDetailWithWebsite[];
}

export type DomainWithWebsite = Database["public"]["Tables"]["edoscentreadmin_domains"]["Row"] & {
  edoscentreadmin_websites: { name: string; slug: string } | null;
};

export async function getDomains(): Promise<DomainWithWebsite[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentreadmin_domains")
    .select("*, edoscentreadmin_websites(name, slug)")
    .order("expiry_date");
  return (data ?? []) as unknown as DomainWithWebsite[];
}

export type SslCertificateWithRelations = Database["public"]["Tables"]["edoscentreadmin_ssl_certificates"]["Row"] & {
  edoscentreadmin_websites: { name: string; slug: string } | null;
  edoscentreadmin_domains: { domain_name: string } | null;
};

export async function getSslCertificates(): Promise<SslCertificateWithRelations[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentreadmin_ssl_certificates")
    .select("*, edoscentreadmin_websites(name, slug), edoscentreadmin_domains(domain_name)")
    .order("expiry_date");
  return (data ?? []) as unknown as SslCertificateWithRelations[];
}

function lastNMonths(n: number): { key: string; label: string; start: Date; end: Date }[] {
  const months: { key: string; label: string; start: Date; end: Date }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    months.push({
      key: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`,
      label: start.toLocaleDateString("en-US", { month: "short" }),
      start,
      end,
    });
  }
  return months;
}

export async function getRevenueByMonth(monthsBack = 12) {
  const supabase = await createClient();
  const months = lastNMonths(monthsBack);
  const { data } = await supabase
    .from("edoscentreadmin_payments")
    .select("amount, payment_date, status")
    .eq("status", "completed")
    .gte("payment_date", months[0].start.toISOString().slice(0, 10));

  return months.map((m) => {
    const total = (data ?? [])
      .filter((p) => {
        const d = new Date(p.payment_date);
        return d >= m.start && d < m.end;
      })
      .reduce((sum, p) => sum + Number(p.amount), 0);
    return { label: m.label, value: total };
  });
}

export async function getLeadsByMonth(monthsBack = 12) {
  const supabase = await createClient();
  const months = lastNMonths(monthsBack);
  const sinceStr = months[0].start.toISOString();

  const [contact, consultation] = await Promise.all([
    supabase.from("edoscentre_contact_inquiries").select("created_at").gte("created_at", sinceStr),
    supabase.from("edoscentre_consultation_bookings").select("created_at").gte("created_at", sinceStr),
  ]);
  const combined = [...(contact.data ?? []), ...(consultation.data ?? [])];

  return months.map((m) => {
    const count = combined.filter((r) => {
      const d = new Date(r.created_at);
      return d >= m.start && d < m.end;
    }).length;
    return { label: m.label, value: count };
  });
}

export async function getLeadsByType() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentre_contact_inquiries").select("inquiry_type");
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.inquiry_type, (counts.get(row.inquiry_type) ?? 0) + 1);
  }
  const total = data?.length ?? 0;
  return { items: [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count), total };
}

export async function getConsultationsByStatus() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentre_consultation_bookings").select("status");
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  }
  const total = data?.length ?? 0;
  return { items: [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count), total };
}

export async function getSubscriptionStatusBreakdown() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentreadmin_subscriptions").select("status");
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  }
  const total = data?.length ?? 0;
  return { items: [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count), total };
}

export async function getInvoiceStatusBreakdown() {
  const supabase = await createClient();
  const { data } = await supabase.from("edoscentreadmin_invoices").select("status, total");
  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  }
  const total = data?.length ?? 0;
  const totalBilled = (data ?? []).reduce((sum, r) => sum + Number(r.total), 0);
  return { items: [...counts.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count), total, totalBilled };
}

export async function getTopBlogPosts(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentre_blog_posts")
    .select("id, slug, title, view_count, is_published")
    .order("view_count", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export type AdminUserWithWebsites = Database["public"]["Tables"]["edoscentreadmin_admin_users"]["Row"] & {
  edoscentreadmin_admin_user_websites: { website_id: string }[];
};

export async function getAdminUsers(): Promise<AdminUserWithWebsites[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentreadmin_admin_users")
    .select("*, edoscentreadmin_admin_user_websites(website_id)")
    .order("created_at");
  return (data ?? []) as unknown as AdminUserWithWebsites[];
}

export async function getNotifications(recipientId: string, limit = 50) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("edoscentreadmin_notifications")
    .select("*")
    .eq("recipient_id", recipientId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getUnreadNotificationCount(recipientId: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("edoscentreadmin_notifications")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", recipientId)
    .eq("is_read", false);
  return count ?? 0;
}

export type AttentionItem =
  | { type: "website"; id: string; label: string; detail: string | null; status: string; href: string }
  | { type: "domain"; id: string; label: string; detail: string; expired: boolean; href: string }
  | { type: "ssl"; id: string; label: string; detail: string; expired: boolean; href: string };

const EXPIRY_WARNING_DAYS = 30;

export async function getDashboardStats() {
  const supabase = await createClient();
  const warningDate = new Date();
  warningDate.setDate(warningDate.getDate() + EXPIRY_WARNING_DAYS);
  const warningDateStr = warningDate.toISOString().slice(0, 10);
  const todayStr = new Date().toISOString().slice(0, 10);

  const [
    { count: websiteCount },
    { count: activeCount },
    contactNew,
    consultationNew,
    newsletterNew,
    needsAttention,
    expiringDomains,
    expiringCerts,
  ] = await Promise.all([
    supabase.from("edoscentreadmin_websites").select("*", { count: "exact", head: true }),
    supabase.from("edoscentreadmin_websites").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("edoscentre_contact_inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("edoscentre_consultation_bookings").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("edoscentre_newsletter_subscribers").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("edoscentreadmin_websites").select("*").neq("status", "active").order("status_changed_at", { ascending: false }),
    supabase
      .from("edoscentreadmin_domains")
      .select("*, edoscentreadmin_websites(name, slug)")
      .eq("status", "active")
      .lte("expiry_date", warningDateStr)
      .order("expiry_date"),
    supabase
      .from("edoscentreadmin_ssl_certificates")
      .select("*, edoscentreadmin_websites(name, slug)")
      .eq("status", "active")
      .lte("expiry_date", warningDateStr)
      .order("expiry_date"),
  ]);

  const attention: AttentionItem[] = [
    ...(needsAttention.data ?? []).map((site) => ({
      type: "website" as const,
      id: site.id,
      label: site.name,
      detail: site.status_reason,
      status: site.status,
      href: `/admin/websites/${site.slug}`,
    })),
    ...((expiringDomains.data ?? []) as unknown as DomainWithWebsite[]).map((d) => ({
      type: "domain" as const,
      id: d.id,
      label: `${d.domain_name} (${d.edoscentreadmin_websites?.name ?? "—"})`,
      detail: d.expiry_date < todayStr ? `Expired ${formatDate(d.expiry_date)}` : `Expires ${formatDate(d.expiry_date)}`,
      expired: d.expiry_date < todayStr,
      href: "/admin/hosting",
    })),
    ...((expiringCerts.data ?? []) as unknown as SslCertificateWithRelations[]).map((c) => ({
      type: "ssl" as const,
      id: c.id,
      label: `SSL — ${c.edoscentreadmin_websites?.name ?? "—"}`,
      detail: c.expiry_date < todayStr ? `Expired ${formatDate(c.expiry_date)}` : `Expires ${formatDate(c.expiry_date)}`,
      expired: c.expiry_date < todayStr,
      href: "/admin/hosting",
    })),
  ];

  return {
    totalWebsites: websiteCount ?? 0,
    activeWebsites: activeCount ?? 0,
    newFormSubmissions: (contactNew.count ?? 0) + (consultationNew.count ?? 0),
    newsletterSubscribers: newsletterNew.count ?? 0,
    websitesNeedingAttention: attention,
  };
}
