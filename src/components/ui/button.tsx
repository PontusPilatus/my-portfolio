import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background active:scale-95",
  {
    variants: {
      variant: {
        default:
          "relative overflow-hidden backdrop-blur-sm bg-primary/80 border border-primary/20 shadow-lg shadow-primary/10 hover:shadow-primary/30 text-primary-foreground hover:bg-primary/90 hover:border-primary/40 after:absolute after:inset-0 after:bg-gradient-to-tr after:from-white/20 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity",
        destructive:
          "relative overflow-hidden backdrop-blur-sm bg-destructive/80 border border-destructive/20 shadow-lg shadow-destructive/10 hover:shadow-destructive/20 text-destructive-foreground hover:bg-destructive/90 hover:border-destructive/40",
        outline:
          "relative backdrop-blur-sm border border-input bg-white/30 hover:bg-accent/50 hover:text-accent-foreground text-foreground shadow-sm",
        secondary:
          "relative overflow-hidden backdrop-blur-sm bg-secondary/80 border border-secondary/20 text-secondary-foreground shadow-sm hover:bg-secondary/90 after:absolute after:inset-0 after:bg-gradient-to-tr after:from-white/10 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity",
        ghost: "backdrop-blur-sm hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "relative backdrop-blur-[12px] bg-white/20 dark:bg-black/20 border border-white/20 dark:border-white/10 shadow-lg shadow-black/5 text-foreground hover:bg-white/30 dark:hover:bg-black/30 active:scale-95 transition-all duration-300 overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-tr after:from-white/20 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
