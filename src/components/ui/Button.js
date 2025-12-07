import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ff88] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:grayscale",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        // Jungle Green / Pro Variants
        jungle: "relative bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/50 hover:bg-[#00ff88] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all font-bold tracking-wide",
        "jungle-outline": "relative bg-transparent text-[#00ff88] border border-[#00ff88] hover:bg-[#00ff88]/10 transition-all",
        glass: "relative bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/30 transition-all",
        "glass-jungle": "relative bg-[#00ff88]/5 backdrop-blur-md border border-[#00ff88]/20 text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/50 transition-all",
        cinema: "relative bg-black/80 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-white/30 transition-all uppercase tracking-widest font-bold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
