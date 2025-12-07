"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const sliderVariants = cva(
  "relative flex w-full touch-none select-none items-center",
  {
    variants: {
      variant: {
        default: "",
        neural: "[&_[data-radix-slider-track]]:bg-void-neural/50 [&_[data-radix-slider-range]]:bg-neon-cyan [&_[data-radix-slider-thumb]]:border-neon-cyan [&_[data-radix-slider-thumb]]:shadow-neon-cyan [&_[data-radix-slider-thumb]]:bg-neon-cyan/20",
        "neural-purple": "[&_[data-radix-slider-track]]:bg-void-neural/50 [&_[data-radix-slider-range]]:bg-neon-purple [&_[data-radix-slider-thumb]]:border-neon-purple [&_[data-radix-slider-thumb]]:shadow-neon-purple [&_[data-radix-slider-thumb]]:bg-neon-purple/20",
        "neural-magenta": "[&_[data-radix-slider-track]]:bg-void-neural/50 [&_[data-radix-slider-range]]:bg-neon-magenta [&_[data-radix-slider-thumb]]:border-neon-magenta [&_[data-radix-slider-thumb]]:shadow-neon-magenta [&_[data-radix-slider-thumb]]:bg-neon-magenta/20",
        holo: "[&_[data-radix-slider-track]]:bg-gradient-to-r [&_[data-radix-slider-track]]:from-void-neural/30 [&_[data-radix-slider-track]]:to-void-neural/50 [&_[data-radix-slider-range]]:bg-gradient-to-r [&_[data-radix-slider-range]]:from-neon-cyan [&_[data-radix-slider-range]]:via-neon-purple [&_[data-radix-slider-range]]:to-neon-magenta [&_[data-radix-slider-thumb]]:border-neon-cyan [&_[data-radix-slider-thumb]]:shadow-neon-holo [&_[data-radix-slider-thumb]]:bg-void-deep",
        video: "cursor-pointer [&_[data-radix-slider-track]]:!h-1 [&_[data-radix-slider-track]]:bg-white/20 group-hover/slider:[&_[data-radix-slider-track]]:!h-1.5 [&_[data-radix-slider-track]]:transition-all [&_[data-radix-slider-range]]:bg-[#00ff88] [&_[data-radix-slider-thumb]]:!h-3 [&_[data-radix-slider-thumb]]:!w-3 [&_[data-radix-slider-thumb]]:bg-[#00ff88] [&_[data-radix-slider-thumb]]:border-0 [&_[data-radix-slider-thumb]]:shadow-[0_0_10px_#00ff88] [&_[data-radix-slider-thumb]]:opacity-0 group-hover/slider:[&_[data-radix-slider-thumb]]:opacity-100 group-hover/slider:[&_[data-radix-slider-thumb]]:scale-125 transition-all",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Slider = React.forwardRef(({ className, variant, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(sliderVariants({ variant }), className)}
    {...props}>
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary transition-all">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider, sliderVariants }
