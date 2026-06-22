// Billing Usage Widget Component.
// Embedded in the dashboard sidebar to provide real-time billing visibility.
// Dynamically toggles between an "Upgrade" CTA (for unsubscribed orgs) 
// and a live "Estimated Cost" meter (for subscribed orgs).
import { useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Crown, Activity, Sparkles, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCheckout } from "@/features/billing/hooks/use-checkout";
import { useTRPC } from "@/trpc/client";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function UpgradeCard() {
  const { checkout, isPending: isCheckoutPending } = useCheckout();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1">
          <Crown className="size-3.5 text-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
            Resona Pro
          </span>
        </div>

        <Sparkles className="size-4 text-primary/70" />
      </div>

      <div>
        <p className="text-2xl font-black tracking-tight text-foreground">
          Usage-based
        </p>

        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Premium voice generation with transparent pricing
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-border/50 bg-background/60 p-3">
          <p className="text-lg font-bold tracking-tight text-foreground">
            $0.30
          </p>
          <p className="text-[11px] text-muted-foreground">per 1K chars</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-background/60 p-3">
          <p className="text-lg font-bold tracking-tight text-foreground">
            $0.20
          </p>
          <p className="text-[11px] text-muted-foreground">per voice</p>
        </div>
      </div>

      <Button
        variant="ctaGlow"
        className="w-full cursor-pointer"
        size="sm"
        disabled={isCheckoutPending}
        onClick={checkout}
      >
        {isCheckoutPending ? (
          <>
            <Spinner className="size-3" />
            Redirecting...
          </>
        ) : (
          <>
            Upgrade
            <ArrowUpRight className="size-4" />
          </>
        )}
      </Button>
    </div>
  );
}

function UsageCard({ estimatedCostCents }: { estimatedCostCents: number }) {
  const trpc = useTRPC();

  const portalMutation = useMutation(
    trpc.billing.createPortalSession.mutationOptions({}),
  );

  const openPortal = useCallback(() => {
    portalMutation.mutate(undefined, {
      onSuccess: (data) => {
        window.open(data.portalUrl, "_blank");
      },
    });
  }, [portalMutation]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-1">
          <Activity className="size-3.5 text-emerald-600" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
            Live Usage
          </span>
        </div>

        <div className="size-2 animate-pulse rounded-full bg-emerald-500" />
      </div>

      <div>
        <p className="text-3xl font-black tracking-tight text-foreground">
          {formatCurrency(estimatedCostCents)}
        </p>

        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Estimated usage charges so far
        </p>
      </div>

      <Button
        variant="secondary"
        className="w-full cursor-pointer"
        size="sm"
        disabled={portalMutation.isPending}
        onClick={openPortal}
      >
        {portalMutation.isPending ? (
          <>
            <Spinner className="size-3" />
            Redirecting...
          </>
        ) : (
          <>
            Billing Portal
            <ArrowUpRight className="size-4" />
          </>
        )}
      </Button>
    </div>
  );
}

export function UsageContainer() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.billing.getStatus.queryOptions());

  return (
    <div className="group-data-[collapsible=icon]:hidden rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md">
      {/* 
        Conditional Billing UI:
        Subscribed orgs see their accrued usage from Polar meters.
        Unsubscribed orgs see a static pricing breakdown and upgrade prompt. 
      */}
      {data?.hasActiveSubscription ? (
        <UsageCard estimatedCostCents={data.estimatedCostCents} />
      ) : (
        <UpgradeCard />
      )}
    </div>
  );
}
