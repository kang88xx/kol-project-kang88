import { cn } from "@/lib/utils";
import type { AssignmentType, Platform } from "@/lib/metrics";

const chip = "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-caption-2 font-semibold uppercase";

export function TypeBadge({ type, className }: { type: AssignmentType; className?: string }) {
  const assigned = type === "ASSIGNED";
  return (
    <span
      className={cn(chip, className)}
      style={{ background: assigned ? "var(--assigned-soft)" : "var(--organic-soft)", color: assigned ? "var(--assigned)" : "var(--organic)" }}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {assigned ? "Assigned" : "Organic"}
    </span>
  );
}

export function PlatformBadge({ platform, className }: { platform: Platform; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md border border-border px-1.5 py-0.5 text-caption-2 font-medium text-label-neutral", className)}>
      {platform === "TELEGRAM" ? "Telegram" : "X"}
    </span>
  );
}

export function StatusBadge({ status }: { status: "DRAFT" | "ACTIVE" | "ENDED" }) {
  const styles = {
    ACTIVE: "bg-positive-bg text-positive",
    ENDED: "bg-fill text-label-neutral",
    DRAFT: "bg-cautionary-bg text-cautionary",
  } as const;
  const label = { ACTIVE: "Active", ENDED: "Ended", DRAFT: "Draft" }[status];
  return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-caption-1 font-semibold", styles[status])}>{label}</span>;
}
