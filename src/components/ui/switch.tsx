"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/50 data-[size=default]:h-[22px] data-[size=default]:w-[40px] data-[size=sm]:h-[16px] data-[size=sm]:w-[28px] data-disabled:cursor-not-allowed data-disabled:opacity-50",
        /* Carved track */
        "shadow-[inset_0_3px_8px_rgba(0,0,0,0.55),inset_0_1px_2px_rgba(0,0,0,0.35),inset_0_-1px_0_rgba(255,255,255,0.05)]",
        "data-unchecked:bg-[rgba(255,255,255,0.06)]",
        "data-checked:bg-primary/80 data-checked:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_0_12px_rgba(186,158,255,0.3)]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full ring-0 transition-transform",
          "group-data-[size=default]/switch:size-[18px] group-data-[size=sm]/switch:size-[12px]",
          /* Raised thumb with bevel */
          "bg-gradient-to-b from-white/90 to-white/70",
          "shadow-[0_2px_6px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.85)]",
          "group-data-[size=default]/switch:data-checked:translate-x-[calc(100%)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%)]",
          "group-data-[size=default]/switch:data-unchecked:translate-x-[1px] group-data-[size=sm]/switch:data-unchecked:translate-x-[1px]",
          /* Glow when checked */
          "data-checked:shadow-[0_1px_4px_rgba(0,0,0,0.4),0_0_8px_rgba(186,158,255,0.5),inset_0_1px_0_rgba(255,255,255,0.8)]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
