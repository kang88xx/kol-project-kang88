import { formatCompact, formatNumber } from "@/lib/format";

export function StatTile({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="surface p-5">
      <div className="text-label-2 font-medium text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-title-2 font-bold tabular-nums text-label-strong" title={formatNumber(value)}>
        {formatCompact(value)}
      </div>
      {hint && <div className="mt-1 text-caption-1 text-muted-foreground">{hint}</div>}
    </div>
  );
}
