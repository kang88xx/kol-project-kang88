const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const plain = new Intl.NumberFormat("en");

export function formatCompact(n: number): string {
  return compact.format(n);
}

export function formatNumber(n: number): string {
  return plain.format(n);
}

export function formatPercent(ratio: number, digits = 1): string {
  return `${(ratio * 100).toFixed(digits)}%`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export function formatShortDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${MONTHS[date.getUTCMonth()]} ${String(date.getUTCDate()).padStart(2, "0")}`;
}

export function formatDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${formatDate(date)} ${hh}:${mm}`;
}

export function formatPeriod(start: Date, end: Date | null): string {
  return end ? `${formatDate(start)} – ${formatDate(end)}` : `${formatDate(start)} –`;
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
