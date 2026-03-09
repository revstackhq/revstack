import Stripe from "stripe";
import {
  ProviderContext,
  PreviewSubscriptionUpdateInput,
  ProrationPreviewResult,
  AsyncActionResult,
  fromUnixSeconds,
  currentUnixSeconds,
  calculateProrationBreakdown,
  normalizeCurrency,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { mapError } from "@/shared/error-map";

/**
 * Calculates the exact prorated cost of upgrading or downgrading a subscription.
 *
 * This implementation uses the Stripe Invoices Preview API (Clover 2026-02-25)
 * to simulate changes. It leverages Core financial helpers to distinguish
 * between immediate adjustments and future recurring totals.
 *
 * @param ctx - The provider execution context.
 * @param input - Data containing the subscription ID and the target state (new items).
 * @returns An AsyncActionResult with the calculated financial breakdown.
 */
export async function previewSubscriptionUpdate(
  ctx: ProviderContext,
  input: PreviewSubscriptionUpdateInput,
): Promise<AsyncActionResult<ProrationPreviewResult>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);

    // 1. RETRIEVE CURRENT SUBSCRIPTION
    // We fetch the current state to identify which items are being updated vs added.
    const subscription = await stripe.subscriptions.retrieve(
      input.subscriptionId,
    );

    // 2. GENERATE UNIFIED BILLING TIMESTAMP
    // Using the Core helper ensures 'now' is consistent across the entire PDK.
    const prorationDate = currentUnixSeconds();

    // 3. MAP UNIVERSAL BEHAVIORS TO STRIPE ENUMS
    const prorationBehaviorMap: Record<
      string,
      Stripe.InvoiceCreatePreviewParams.SubscriptionDetails.ProrationBehavior
    > = {
      none: "none",
      deferred: "create_prorations",
      immediate: "always_invoice",
    };

    const stripeProrationBehavior =
      prorationBehaviorMap[input.prorationBehavior ?? "deferred"] ??
      "create_prorations";

    // 4. CONSTRUCT TARGET LINE ITEMS (Delta Analysis)
    // Map requested items and include IDs for existing ones to trigger updates.
    const items: Stripe.InvoiceCreatePreviewParams.SubscriptionDetails.Item[] =
      input.items.map((item) => {
        const existingItem = subscription.items.data.find(
          (si) => si.price.id === item.priceId,
        );

        return {
          id: existingItem?.id,
          price: item.priceId,
          quantity: item.quantity,
        };
      });

    // Explicitly mark missing items as deleted to ensure an accurate preview.
    for (const existingItem of subscription.items.data) {
      const stillPresent = input.items.some(
        (i) => i.priceId === existingItem.price.id,
      );
      if (!stillPresent) {
        items.push({
          id: existingItem.id,
          deleted: true,
        });
      }
    }

    // 5. INVOKE STRIPE CLOVER PREVIEW API
    // Per Clover spec, subscription parameters are nested in 'subscription_details'.
    const upcomingInvoice = await stripe.invoices.createPreview({
      customer:
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id,
      subscription: input.subscriptionId,
      subscription_details: {
        items: items,
        proration_behavior: stripeProrationBehavior,
        proration_date: prorationDate,
      },
    });

    // 6. CALCULATE FINANCIAL IMPACT (Core Delegation)
    //
    // We provide the Stripe-specific predicate to identify proration lines.
    const { immediateCharge, recurringTotal } = calculateProrationBreakdown(
      upcomingInvoice.lines.data,
      (line) => {
        // In Clover, proration flags live inside the parent details object.
        const details =
          line.parent?.subscription_item_details ||
          line.parent?.invoice_item_details;
        return !!details?.proration;
      },
      (line) => line.amount,
    );

    return {
      data: {
        immediateChargeAmount: immediateCharge,
        newRecurringAmount: recurringTotal,
        currency: normalizeCurrency(upcomingInvoice.currency, "uppercase"),
        prorationDate: fromUnixSeconds(prorationDate),
      },
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
