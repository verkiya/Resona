import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",

        ctaGlow:
          "relative bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))] text-white font-semibold shadow-lg hover:brightness-110 active:scale-[0.97] before:absolute before:inset-0 before:rounded-md before:bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))] before:blur-lg before:opacity-40 before:-z-10",

        softGradient:
          "bg-[linear-gradient(120deg,oklch(0.85_0.08_60),oklch(0.75_0.12_300))] text-foreground border border-border shadow-sm hover:brightness-105 hover:saturate-110 hover:shadow-md active:scale-[0.99]",

        accentFill:
          "bg-accent/80 text-white font-medium shadow-sm hover:bg-accent hover:shadow-md data-[active=true]:bg-accent data-[active=true]:text-white",

        subtleCta:
          "bg-muted text-foreground border border-border hover:bg-[linear-gradient(90deg,oklch(0.85_0.08_60),oklch(0.75_0.12_300))] hover:text-white",

        outlineAccent:
          "border border-accent/40 text-accent hover:bg-accent/10 hover:border-accent",

        glassCta:
          "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-lg",

        success:
          "bg-[linear-gradient(90deg,#34d399,#4ade80)] text-white font-medium shadow-sm hover:brightness-110",

        warning:
          "bg-[linear-gradient(90deg,oklch(0.78_0.16_85),oklch(0.72_0.18_65))] text-black font-medium shadow-sm hover:brightness-105 active:scale-[0.98]",

        premiumDark:
          "bg-[linear-gradient(135deg,oklch(0.18_0.02_260),oklch(0.28_0.04_280))] text-white border border-white/10 shadow-lg hover:brightness-110 hover:shadow-xl active:scale-[0.98]",

        neonAi:
          "bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300),oklch(0.78_0.12_220))] text-white font-semibold shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:brightness-100 hover:shadow-[0_0_28px_rgba(168,85,247,0.45)] active:scale-[0.97]",

        elevated:
          "bg-card border border-border/60 shadow-sm text-foreground hover:shadow-md hover:bg-muted active:scale-[0.99]",

        frosted:
          "bg-background/40 backdrop-blur-xl border border-border/50 text-foreground shadow-sm hover:bg-background/60 hover:shadow-md",

        activeSidebar:
          "bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))] text-white font-semibold shadow-lg ring-2 ring-white/20 brightness-110",

        pillGradient:
          "rounded-full bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))] text-white font-medium px-5 shadow-md hover:brightness-110 active:scale-[0.98]",

        dangerOutline:
          "border border-destructive/40 text-destructive bg-transparent hover:bg-destructive/10 hover:border-destructive hover:shadow-sm",

        subtleDanger:
          "bg-destructive/8 text-destructive border border-destructive/20 hover:bg-destructive/15",

        iconMuted:
          "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",

        minimalGhost:
          "text-muted-foreground hover:text-foreground hover:bg-transparent",

        shimmerCta:
          "relative overflow-hidden bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))] text-white font-semibold before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent)] before:animate-[shimmer_1.6s_infinite]",

        loading:
          "relative overflow-hidden bg-muted text-muted-foreground before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.4),transparent)] before:animate-[shimmer_1.5s_infinite]",

        destructive: "bg-destructive text-white hover:bg-destructive/90",

        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",

        secondary:
          "bg-secondary/40 text-secondary-foreground hover:bg-secondary/60",

        ghost: "hover:bg-accent hover:text-accent-foreground",

        link: "text-primary underline-offset-4 hover:underline",
      },

      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",

        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",

        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",

        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",

        xl: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",

        icon: "size-9",

        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",

        "icon-sm": "size-8",

        "icon-lg": "size-10",

        "icon-xl": "size-12 rounded-lg [&_svg:not([class*='size-'])]:size-5",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
