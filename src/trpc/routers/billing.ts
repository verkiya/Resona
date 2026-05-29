// Billing tRPC Router.
// Manages Polar.sh checkout and customer portal sessions.
// Enforces multi-tenancy by using the Clerk `orgId` as Polar's `externalCustomerId`.
// This guarantees subscriptions and metered usage accrue to the organization, not the individual user.
import { TRPCError } from "@trpc/server";
import { polar } from "@/lib/polar";
import { env } from "@/lib/env";
import { createTRPCRouter, orgProcedure } from "../init";

export const billingRouter = createTRPCRouter({
  createCheckout: orgProcedure.mutation(async ({ ctx }) => {
    const result = await polar.checkouts.create({
      products: [env.POLAR_PRODUCT_ID],
      // We map Polar's externalCustomerId to the Clerk orgId. 
      // This is the core mechanism that makes the billing multi-tenant.
      externalCustomerId: ctx.orgId,
      successUrl: process.env.APP_URL,
    });

    if (!result.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create checkout session",
      });
    }

    return { checkoutUrl: result.url };
  }),

  createPortalSession: orgProcedure.mutation(async ({ ctx }) => {
    const result = await polar.customerSessions.create({
      externalCustomerId: ctx.orgId,
    });

    if (!result.customerPortalUrl) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create customer portal session",
      });
    }

    return { portalUrl: result.customerPortalUrl };
  }),

  getStatus: orgProcedure.query(async ({ ctx }) => {
    try {
      const customerState = await polar.customers.getStateExternal({
        externalId: ctx.orgId,
      });

      const hasActiveSubscription =
        (customerState.activeSubscriptions ?? []).length > 0;

      // Aggregate meter amounts across all active subscriptions 
      // to calculate the estimated usage cost displayed in the dashboard sidebar.
      let estimatedCostCents = 0;
      for (const sub of customerState.activeSubscriptions ?? []) {
        for (const meter of sub.meters ?? []) {
          estimatedCostCents += meter.amount ?? 0;
        }
      }

      return {
        hasActiveSubscription,
        customerId: customerState.id,
        estimatedCostCents,
      };
    } catch {
      // If the org has never initiated checkout, Polar will throw an error because the customer record doesn't exist.
      // We catch this gracefully and treat it as a valid "unsubscribed" state.
      return {
        hasActiveSubscription: false,
        customerId: null,
        estimatedCostCents: 0,
      };
    }
  }),
});
