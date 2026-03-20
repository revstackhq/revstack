import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  CreatePriceInput,
  AsyncActionResult,
  normalizeCurrency,
  RevstackError,
  RevstackErrorCode,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import Stripe from "stripe";

/**
 * Creates a new price attached to a product in Stripe.
 * Includes a Reverse Mapper to translate Revstack's universal billing schemes
 * into Stripe's native configurations (metered, custom, tiered, etc.).
 */
export async function createPrice(
  ctx: ProviderContext,
  input: CreatePriceInput,
): Promise<AsyncActionResult<string>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);

    // 1. Base Parameters (Common to all types)
    const params: Stripe.PriceCreateParams = {
      product: input.productId,
      currency: normalizeCurrency(input.currency, "lowercase"),
      active: input.active ?? true,
      metadata: input.metadata as Record<string, string> | undefined,
    };

    // 2. Base Recurring setup (if interval is provided)
    if (input.interval) {
      params.recurring = {
        interval: input.interval,
        interval_count: input.intervalCount ?? 1,
      };
    }

    // 3. REVERSE MAPPER: Translate Revstack Scheme -> Stripe config
    switch (input.billingScheme) {
      case "free":
        params.unit_amount = 0;
        break;

      case "metered":
        params.unit_amount = input.unitAmount;
        // Stripe requires a recurring interval for metered usage (default to month if missing)
        params.recurring = params.recurring || { interval: "month" };
        params.recurring.usage_type = "metered";
        break;

      case "tiered_volume":
      case "tiered_graduated":
        params.billing_scheme = "tiered";
        params.tiers_mode =
          input.billingScheme === "tiered_graduated" ? "graduated" : "volume";

        if (!input.tiers || input.tiers.length === 0) {
          throw new RevstackError({
            code: RevstackErrorCode.InvalidInput,
            cause: "REQUIRED_FIELD",
            message:
              "Stripe requires a 'tiers' array to create a tiered price.",
          });
        }

        params.tiers = input.tiers.map((t) => ({
          up_to: t.maxUnits ?? "inf",
          unit_amount: Math.round(t.unitAmount),
          flat_amount: t.flatAmount ? Math.round(t.flatAmount) : undefined,
        }));
        break;

      case "flat":
      case "per_unit":
      default:
        params.unit_amount = input.unitAmount;
        break;
    }

    const price = await stripe.prices.create(params, {
      idempotencyKey: ctx.idempotencyKey,
    });

    return { data: price.id, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
}
