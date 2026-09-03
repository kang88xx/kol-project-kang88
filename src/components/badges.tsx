import { cn } from "@/lib/utils";
import type { AssignmentType, Platform } from "@/lib/metrics";

export function TypeBadge({ type, className }: { type: AssignmentType; className?: string }) {
  const assigned = type === "ASSIGNED";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        assigned ? "bg-[var(--assigned-soft)] text-[var(--assigned)]" : "bg-[var(--organic-soft)] text-[var(--organic)]",
        className,
      )}
    >
      <span className="size-1.5 rounded-full" style={{ background: assigned ? "var(--assigned)" : "var(--organic)" }} />
      {assigned ? "Assigned" : "Organic"}
    </span>
  );
}

export function PlatformBadge({ platform, className }: { platform: Platform; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground", className)}>
      {platform === "TELEGRAM" ? "Telegram" : "X"}
    </span>
  );
}

export function StatusBadge({ status }: { status: "DRAFT" | "ACTIVE" | "ENDED" }) {
  const styles = {
    ACTIVE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    ENDED: "border-border bg-muted text-muted-foreground",
    DRAFT: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  } as const;
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide", styles[status])}>
      {status}
    </span>
  );
}
