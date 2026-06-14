"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

const INQUIRY_TYPES = [
  { value: "general",    label: "General Inquiry" },
  { value: "project",    label: "New Project" },
  { value: "partnership", label: "Partnership" },
  { value: "careers",   label: "Careers" },
  { value: "media",     label: "Media & Press" },
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError]   = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const fd   = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    const res = await fetch("/api/contact", {
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
      <div className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="font-display font-bold text-2xl text-brand-navy mb-2">Message sent!</h3>
        <p className="text-gray-500">
          We&apos;ll get back to you within 24 hours. Check your email for a confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full Name" name="full_name" type="text" placeholder="Jane Mwangi" required />
        <Field label="Email Address" name="email" type="email" placeholder="jane@org.ke" required />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Phone (optional)" name="phone" type="tel" placeholder="+254 7XX XXX XXX" />
        <Field label="Organization" name="organization" type="text" placeholder="County Government / NGO..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-navy mb-1.5">Inquiry Type</label>
        <select
          name="inquiry_type"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-navy text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
        >
          {INQUIRY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      <Field label="Subject" name="subject" type="text" placeholder="DHIS2 implementation / M&E system / Data pipeline…" />

      <div>
        <label className="block text-sm font-medium text-brand-navy mb-1.5">
          Message <span className="text-brand-red">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us about your project, challenge, or question…"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-brand-navy text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors resize-none"
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
          <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</>
        ) : (
          <><Send className="w-5 h-5" /> Send Message</>
        )}
      </button>
    </form>
  );
}

function Field({
  label, name, type, placeholder, required,
}: {
  label: string; name: string; type: string; placeholder?: string; required?: boolean;
}) {
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
