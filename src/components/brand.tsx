import { cn } from "@/lib/utils";

/** Uplink mark: an up-arrow joined to a baseline node — "connect and lift". */
export function UplinkMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("size-6", className)}>
      <path d="M12 19V6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6.5 11.5 12 6l5.5 5.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="19.5" r="2" fill="currentColor" />
    </svg>
  );
}

export function UplinkLogo({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const box = { sm: "size-7 rounded-md", md: "size-8 rounded-lg", lg: "size-12 rounded-xl" }[size];
  const mark = { sm: "size-4", md: "size-5", lg: "size-7" }[size];
  const word = { sm: "text-headline-2", md: "text-headline-1", lg: "text-title-3" }[size];
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className={cn("flex items-center justify-center bg-primary text-primary-foreground", box)}>
        <UplinkMark className={mark} />
      </span>
      <span className={cn("font-brand font-bold tracking-[-0.02em] text-label-strong", word)}>Uplink</span>
    </span>
  );
}
