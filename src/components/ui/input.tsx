import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border bg-transparent px-3 py-2 text-base transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm glass-skeuo-inset focus:translate-y-[1px]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
