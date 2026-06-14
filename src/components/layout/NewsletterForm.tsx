"use client";

import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    await fetch("/api/newsletter", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, source: "footer" }),
    });
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-white/70">
        <CheckCircle2 className="w-5 h-5 text-green-400" />
        <span className="text-sm">You&apos;re subscribed! Check your email.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 md:w-72 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-brand-red/50 transition-colors"
      />
      <button type="submit" disabled={status === "loading"} className="btn-primary !py-2.5 shrink-0">
        {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Subscribe</span><ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  );
}
