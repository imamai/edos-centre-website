"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Calendar } from "lucide-react";

const SERVICES = [
  "Data Analytics",
  "Data Engineering",
  "SaaS Development",
  "Dashboard Development",
  "Web Development",
  "Mobile Applications",
  "M&E Systems",
  "DHIS2 Integration",
  "Questionnaire Digitization",
  "Other",
];

const INDUSTRIES = [
  "Healthcare", "NGOs & Development", "Government", "Education",
  "Agriculture", "Financial Services", "Retail & Logistics", "Other",
];

const BUDGETS = [
  { value: "under_500k",  label: "Under KES 500K" },
  { value: "500k_2m",     label: "KES 500K – 2M" },
  { value: "2m_10m",      label: "KES 2M – 10M" },
  { value: "above_10m",   label: "Above KES 10M" },
  { value: "not_sure",    label: "Not sure yet" },
];

export default function ConsultationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError]   = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const fd   = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    const res = await fetch("/api/consultation", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });

    if (res.ok) {
      setStatus("success");
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-10">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="font-display font-bold text-2xl text-brand-navy mb-3">You&apos;re booked!</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          We&apos;ll send a calendar invite within 24 hours. Check your email — including spam.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full Name" name="full_name" type="text" placeholder="Dr. Jane Mwangi" required />
        <Field label="Email" name="email" type="email" placeholder="jane@org.ke" required />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Phone" name="phone" type="tel" placeholder="+254 7XX XXX XXX" />
        <Field label="Organization" name="organization" type="text" placeholder="Ministry / NGO / Company" />
      </div>

      <Field label="Your Role / Title" name="role_title" type="text" placeholder="Programme Manager / ICT Director / CEO" />

      <div className="grid sm:grid-cols-2 gap-5">
        <SelectField label="Primary Service Interest" name="service_interest" options={SERVICES} />
        <SelectField label="Industry" name="industry" options={INDUSTRIES} />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-navy mb-1.5">Project Summary</label>
        <textarea
          name="project_summary"
          rows={4}
          placeholder="Briefly describe your project or challenge…"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-navy text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors resize-none"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <SelectField
          label="Estimated Budget"
          name="budget_range"
          options={BUDGETS.map((b) => b.label)}
          values={BUDGETS.map((b) => b.value)}
        />
        <SelectField
          label="Preferred Time"
          name="preferred_time"
          options={["Morning (8am–12pm)", "Afternoon (12pm–5pm)", "Flexible"]}
          values={["morning", "afternoon", "flexible"]}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-navy mb-1.5">Preferred Date</label>
        <input
          type="date"
          name="preferred_date"
          min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-navy text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full justify-center !py-4"
      >
        {status === "loading" ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</>
        ) : (
          <><Calendar className="w-5 h-5" /> Request Consultation</>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        No commitment required. We respond within 24 hours.
      </p>
    </form>
  );
}

function Field({ label, name, type, placeholder, required }: { label: string; name: string; type: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-navy mb-1.5">
        {label} {required && <span className="text-brand-red">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-navy text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
      />
    </div>
  );
}

function SelectField({ label, name, options, values }: { label: string; name: string; options: string[]; values?: string[] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-navy mb-1.5">{label}</label>
      <select
        name={name}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-navy text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
      >
        <option value="">Select…</option>
        {options.map((opt, i) => (
          <option key={opt} value={values ? values[i] : opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
