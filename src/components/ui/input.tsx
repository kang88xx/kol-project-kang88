import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

/* Montage text field: fill-normal background, line-normal border, primary ring on focus. */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-input bg-elevated px-3 py-2 text-body-2 text-foreground transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-label-1 file:font-medium file:text-foreground placeholder:text-label-assistive hover:border-[var(--semantic-line-normal-neutral)] focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[var(--semantic-interaction-disable)] disabled:text-label-disable aria-invalid:border-negative aria-invalid:ring-3 aria-invalid:ring-negative/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
