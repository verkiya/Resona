// shadcn/ui presentational primitive; Resona product behavior lives in src/features and src/app.
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",

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

        successSoft:
          "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/15",

        warning:
          "bg-[linear-gradient(90deg,oklch(0.78_0.16_85),oklch(0.72_0.18_65))] text-black font-medium shadow-sm hover:brightness-105 active:scale-[0.98]",

        premiumDark:
          "bg-[linear-gradient(135deg,oklch(0.18_0.02_260),oklch(0.28_0.04_280))] text-white border border-white/10 shadow-lg hover:brightness-110 hover:shadow-xl active:scale-[0.98]",

        neonAi:
          "bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300),oklch(0.78_0.12_220))] text-white font-semibold shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:brightness-100 hover:shadow-[0_0_28px_rgba(168,85,247,0.45)] active:scale-[0.97]",

        royal:
          "bg-[linear-gradient(135deg,oklch(0.58_0.16_300),oklch(0.68_0.12_330))] text-white font-semibold shadow-md hover:brightness-110 hover:shadow-lg active:scale-[0.98]",

        sunset:
          "bg-[linear-gradient(135deg,oklch(0.72_0.14_40),oklch(0.68_0.18_10))] text-white font-semibold shadow-md hover:brightness-110 active:scale-[0.98]",

        aiPulse:
          "bg-[linear-gradient(90deg,oklch(0.65_0.16_280),oklch(0.72_0.12_220))] text-white font-semibold shadow-[0_0_18px_rgba(124,58,237,0.3)] hover:shadow-[0_0_28px_rgba(124,58,237,0.45)]",

        softPrimary:
          "bg-primary/10 text-primary border border-primary/15 hover:bg-primary/15",

        outlinePrimary:
          "border border-primary/25 text-primary hover:bg-primary/10",

        darkGlass:
          "bg-black/30 text-white border border-white/10 backdrop-blur-xl hover:bg-black/40 shadow-lg",

        activeSidebar:
          "bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))] text-white font-semibold shadow-lg ring-2 ring-white/20 brightness-110",

        sidebarActive:
          "bg-primary/12 text-primary border border-primary/20 shadow-sm",

        pillGradient:
          "rounded-full bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))] text-white font-medium px-5 shadow-md hover:brightness-110 active:scale-[0.98]",

        dangerOutline:
          "border border-destructive/40 text-destructive bg-transparent hover:bg-destructive/10 hover:border-destructive hover:shadow-sm",

        subtleDanger:
          "bg-destructive/8 text-destructive border border-destructive/20 hover:bg-destructive/15",

        dangerGlow:
          "bg-destructive text-white shadow-[0_0_18px_rgba(239,68,68,0.25)] hover:shadow-[0_0_24px_rgba(239,68,68,0.4)] hover:bg-destructive/90",

        iconMuted:
          "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",

        minimalGhost:
          "text-muted-foreground hover:text-foreground hover:bg-transparent",

        purpleGhost:
          "text-purple-500 hover:bg-purple-500/10 hover:text-purple-600",

        editorTab:
          "bg-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-sm",

        audioControl:
          "rounded-full bg-primary text-primary-foreground shadow-sm hover:brightness-110 active:scale-[0.96]",

        shimmerCta:
          "relative overflow-hidden bg-[linear-gradient(90deg,oklch(0.72_0.13_25),oklch(0.75_0.15_300))] text-white font-semibold before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent)] before:animate-[shimmer_1.6s_infinite]",

        loading:
          "relative overflow-hidden bg-muted text-muted-foreground before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.4),transparent)] before:animate-[shimmer_1.5s_infinite]",

        destructive:
          "bg-destructive text-white hover:bg-destructive/90",

        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",

        secondary:
          "bg-secondary/40 text-secondary-foreground hover:bg-secondary/60",

        ghost:
          "hover:bg-accent hover:text-accent-foreground",

        link:
          "text-primary underline-offset-4 hover:underline",
      },

      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",

        xs:
          "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",

        sm:
          "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",

        lg:
          "h-10 rounded-md px-6 has-[>svg]:px-4",

        xl:
          "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",

        icon:
          "size-9",

        "icon-xs":
          "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",

        "icon-sm":
          "size-8",

        "icon-lg":
          "size-10",

        "icon-xl":
          "size-12 rounded-lg [&_svg:not([class*='size-'])]:size-5",
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
