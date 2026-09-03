import { formatCompact, formatNumber } from "@/lib/format";

export function StatTile({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums tracking-tight" title={formatNumber(value)}>
        {formatCompact(value)}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
