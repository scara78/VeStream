import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:ring-ring",
        neural: "bg-void-deep/50 border-neon-cyan/30 text-white placeholder:text-text-tertiary focus-visible:ring-neon-cyan focus-visible:border-neon-cyan focus-visible:shadow-neon-cyan/20",
        "neural-purple": "bg-void-deep/50 border-neon-purple/30 text-white placeholder:text-text-tertiary focus-visible:ring-neon-purple focus-visible:border-neon-purple focus-visible:shadow-neon-purple/20",
        "neural-magenta": "bg-void-deep/50 border-neon-magenta/30 text-white placeholder:text-text-tertiary focus-visible:ring-neon-magenta focus-visible:border-neon-magenta focus-visible:shadow-neon-magenta/20",
        glass: "glass-ultra border-neon-cyan/20 text-white placeholder:text-text-tertiary focus-visible:ring-neon-cyan focus-visible:border-neon-cyan/50",
        cyber: "bg-void-neural border-2 border-neon-cyan/50 text-neon-cyan placeholder:text-neon-cyan/50 focus-visible:ring-neon-cyan focus-visible:border-neon-cyan focus-visible:shadow-neon-cyan/30 font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Input = React.forwardRef(({ className, variant, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input, inputVariants }
