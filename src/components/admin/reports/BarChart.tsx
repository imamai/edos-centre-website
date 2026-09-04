export function BarChart({
  data,
  formatValue = (v) => String(v),
  height = 160,
}: {
  data: { label: string; value: number }[];
  formatValue?: (value: number) => string;
  height?: number;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-1.5 overflow-x-auto pb-1" style={{ height: height + 40 }}>
      {data.map((d) => (
        <div key={d.label} className="flex min-w-[2.25rem] flex-1 flex-col items-center justify-end gap-1" style={{ height: height + 40 }}>
          <span className="text-[10px] font-medium text-slate-500">{d.value > 0 ? formatValue(d.value) : ""}</span>
          <div
            className="w-full rounded-t bg-[#1A1733]/80 transition-all"
            style={{ height: Math.max(2, (d.value / max) * height) }}
            title={`${d.label}: ${formatValue(d.value)}`}
          />
          <span className="text-[10px] text-slate-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function StatusBreakdown({ items, total }: { items: { label: string; count: number; className?: string }[]; total: number }) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between text-sm">
            <span className="capitalize text-slate-600">{item.label.replace(/_/g, " ")}</span>
            <span className="font-medium text-slate-900">{item.count}</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={item.className ?? "bg-[#1A1733]/70"}
              style={{ width: `${total > 0 ? (item.count / total) * 100 : 0}%`, height: "100%" }}
            />
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="text-sm text-slate-400">No data yet.</p>}
    </div>
  );
}
