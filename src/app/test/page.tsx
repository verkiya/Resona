// AI explanation: Internal/dev test page (not part of production user flows).
import { Button } from "@/components/ui/button";
import {
  Play,
  Trash2,
  Sparkles,
  Mic,
  ArrowRight,
  Settings,
} from "lucide-react";

const variants = [
  "default",
  "ctaGlow",
  "softGradient",
  "accentFill",
  "subtleCta",
  "outlineAccent",
  "glassCta",
  "success",
  "successSoft",
  "warning",
  "premiumDark",
  "neonAi",
  "royal",
  "sunset",
  "aiPulse",
  "softPrimary",
  "outlinePrimary",
  "darkGlass",
  "activeSidebar",
  "sidebarActive",
  "pillGradient",
  "dangerOutline",
  "subtleDanger",
  "dangerGlow",
  "iconMuted",
  "minimalGhost",
  "purpleGhost",
  "editorTab",
  "audioControl",
  "shimmerCta",
  "loading",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const;

const sizes = ["xs", "sm", "default", "lg", "xl"] as const;

export default function ButtonLabPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Button Lab</h1>
          <p className="text-muted-foreground">
            Visual testbed for all button variants
          </p>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Variants</h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {variants.map((variant) => (
              <div
                key={variant}
                className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm"
              >
                <div>
                  <p className="font-medium tracking-tight">{variant}</p>
                  <p className="text-xs text-muted-foreground">
                    Button variant preview
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant={variant}>
                    <Sparkles />
                    Action
                  </Button>

                  <Button variant={variant}>
                    Continue
                    <ArrowRight />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Sizes</h2>

          <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-4">
              {sizes.map((size) => (
                <Button key={size} size={size} variant="royal">
                  <Mic />
                  {size}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Icon Sizes</h2>

          <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-4">
              <Button size="icon-xs" variant="iconMuted">
                <Play />
              </Button>

              <Button size="icon-sm" variant="audioControl">
                <Play />
              </Button>

              <Button size="icon" variant="royal">
                <Sparkles />
              </Button>

              <Button size="icon-lg" variant="dangerGlow">
                <Trash2 />
              </Button>

              <Button size="icon-xl" variant="ctaGlow">
                <Settings />
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Real-world Examples</h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6">
              <p className="font-medium">Primary CTA</p>
              <Button variant="ctaGlow" size="lg">
                <Sparkles />
                Generate Voice
              </Button>
            </div>

            <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6">
              <p className="font-medium">Danger Action</p>
              <Button variant="dangerGlow" size="lg">
                <Trash2 />
                Delete Project
              </Button>
            </div>

            <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6">
              <p className="font-medium">AI Feature</p>
              <Button variant="aiPulse" size="lg">
                <Sparkles />
                AI Enhance
              </Button>
            </div>

            <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6">
              <p className="font-medium">Audio Control</p>
              <Button variant="audioControl" size="icon-lg">
                <Play />
              </Button>
            </div>

            <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6">
              <p className="font-medium">Sidebar Active</p>
              <Button variant="sidebarActive">
                <Mic />
                Text to Speech
              </Button>
            </div>

            <div className="space-y-4 rounded-2xl border border-border/50 bg-card/50 p-6">
              <p className="font-medium">Loading State</p>
              <Button variant="loading" size="lg">
                Processing...
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
