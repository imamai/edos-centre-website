import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  trial: "bg-sky-50 text-sky-700 ring-sky-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  suspended: "bg-red-50 text-red-700 ring-red-600/20",
  maintenance: "bg-orange-50 text-orange-700 ring-orange-600/20",
  expired: "bg-slate-100 text-slate-600 ring-slate-500/20",
  archived: "bg-slate-100 text-slate-500 ring-slate-500/20",
  draft: "bg-slate-100 text-slate-600 ring-slate-500/20",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  scheduled: "bg-sky-50 text-sky-700 ring-sky-600/20",
  new: "bg-sky-50 text-sky-700 ring-sky-600/20",
  read: "bg-slate-100 text-slate-600 ring-slate-500/20",
  replied: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  closed: "bg-slate-100 text-slate-500 ring-slate-500/20",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
        STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600 ring-slate-500/20",
        className,
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

const EXPIRY_WARNING_DAYS = 30;

/** Badge whose color/label is derived live from a date, never stored — so it can't go stale. */
export function ExpiryBadge({ date, className }: { date: string | null; className?: string }) {
  if (!date) {
    return (
      <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", "bg-slate-100 text-slate-500 ring-slate-500/20", className)}>
        No date
      </span>
    );
  }

  const days = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const style =
    days < 0
      ? "bg-red-50 text-red-700 ring-red-600/20"
      : days <= EXPIRY_WARNING_DAYS
        ? "bg-amber-50 text-amber-700 ring-amber-600/20"
        : "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  const label = days < 0 ? `Expired ${Math.abs(days)}d ago` : days === 0 ? "Expires today" : `${days}d left`;

  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", style, className)}>{label}</span>;
}
