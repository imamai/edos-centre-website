"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/admin/ui/Card";
import StatusSelect from "@/components/admin/cms/StatusSelect";
import { updateContactStatus, updateConsultationStatus, updateNewsletterStatus } from "@/lib/admin/actions/forms-actions";
import type { Database } from "@/types/database.types";

type Contact = Database["public"]["Tables"]["edoscentre_contact_inquiries"]["Row"];
type Consultation = Database["public"]["Tables"]["edoscentre_consultation_bookings"]["Row"];
type Newsletter = Database["public"]["Tables"]["edoscentre_newsletter_subscribers"]["Row"];

const STATUS_OPTIONS = ["new", "read", "replied", "closed"];

export default function FormsInbox({
  contact,
  consultation,
  newsletter,
}: {
  contact: Contact[];
  consultation: Consultation[];
  newsletter: Newsletter[];
}) {
  const [tab, setTab] = useState<"contact" | "consultation" | "newsletter">("contact");

  const tabs = [
    { key: "contact" as const, label: "Contact", count: contact.length },
    { key: "consultation" as const, label: "Consultation", count: consultation.length },
    { key: "newsletter" as const, label: "Newsletter", count: newsletter.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Forms Inbox</h1>
        <p className="mt-1 text-sm text-slate-500">Submissions from the public site.</p>
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "border-b-2 px-4 py-2.5 text-sm font-medium",
              tab === t.key ? "border-[#1A1733] text-[#1A1733]" : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            {t.label} <span className="ml-1 text-xs text-slate-400">{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "contact" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">From</th>
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-5 py-3">Message</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contact.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400">No contact submissions yet.</td>
                  </tr>
                ) : (
                  contact.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <div className="font-medium text-slate-800">{c.full_name}</div>
                        <div className="text-xs text-slate-400">{c.email}</div>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{c.subject ?? "—"}</td>
                      <td className="max-w-xs truncate px-5 py-3 text-slate-500">{c.message}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-xs text-slate-400">{formatDate(c.created_at)}</td>
                      <td className="px-5 py-3">
                        <StatusSelect id={c.id} status={c.status} options={STATUS_OPTIONS} onChange={updateContactStatus} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "consultation" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">From</th>
                  <th className="px-5 py-3">Project</th>
                  <th className="px-5 py-3">Budget</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {consultation.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-400">No consultation bookings yet.</td>
                  </tr>
                ) : (
                  consultation.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <div className="font-medium text-slate-800">{c.full_name}</div>
                        <div className="text-xs text-slate-400">{c.email}</div>
                      </td>
                      <td className="max-w-xs truncate px-5 py-3 text-slate-500">{c.project_summary ?? "—"}</td>
                      <td className="px-5 py-3 text-slate-600">{c.budget_range ?? "—"}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-xs text-slate-400">{formatDate(c.created_at)}</td>
                      <td className="px-5 py-3">
                        <StatusSelect id={c.id} status={c.status} options={STATUS_OPTIONS} onChange={updateConsultationStatus} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "newsletter" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Subscribed</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {newsletter.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-400">No subscribers yet.</td>
                  </tr>
                ) : (
                  newsletter.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 text-slate-800">{n.email}</td>
                      <td className="px-5 py-3 text-slate-600">{n.full_name ?? "—"}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-xs text-slate-400">{formatDate(n.subscribed_at)}</td>
                      <td className="px-5 py-3">
                        <StatusSelect id={n.id} status={n.status} options={["active", "unsubscribed"]} onChange={updateNewsletterStatus} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
