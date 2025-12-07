import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",

        // Jungle Green / Pro Variants
        jungle: "border-[#00ff88]/50 bg-[#00ff88]/10 text-[#00ff88] hover:bg-[#00ff88]/20 hover:shadow-[0_0_10px_rgba(0,255,136,0.3)]",
        "jungle-outline": "border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-black",
        glass: "bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20",
        "glass-jungle": "bg-[#00ff88]/10 backdrop-blur-md border border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/20",
        cinema: "bg-black/80 backdrop-blur-md border border-white/10 text-white uppercase tracking-wider font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
})
Badge.displayName = "Badge"

export { Badge, badgeVariants }
