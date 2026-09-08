"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ label = "Print / Save as PDF" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-lg bg-[#1A1733] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2650]"
    >
      <Printer className="h-4 w-4" /> {label}
    </button>
  );
}
