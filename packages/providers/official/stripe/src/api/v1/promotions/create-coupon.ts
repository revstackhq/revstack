import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  CreateCouponInput,
  AsyncActionResult,
  normalizeCurrency,
  RevstackErrorCode,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import Stripe from "stripe";

/**
 * Creates a native discount coupon within the provider's ecosystem.
 * Supports both percentage-based and fixed-amount discounts with configurable durations.
 *
 * @param ctx - The provider execution context.
 * @param input - Coupon parameters including discount type, duration, and optional redemption limits.
 * @returns An AsyncActionResult yielding the created coupon ID.
 */
export async function createCoupon(
  ctx: ProviderContext,
  input: CreateCouponInput,
): Promise<AsyncActionResult<string>> {
  if (!input.currency) {
    return {
      data: null,
      status: "failed",
      error: {
        code: RevstackErrorCode.InvalidInput,
        message: "Currency is required.",
      },
    };
  }

  if (!input.code) {
    return {
      data: null,
      status: "failed",
      error: {
        code: RevstackErrorCode.InvalidInput,
        message: "CouponCode is required.",
      },
    };
  }

  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);

    const params: Stripe.CouponCreateParams = {
      id: input.code,
      duration: input.duration,
    };

    if (input.percentOff !== undefined) {
      params.percent_off = input.percentOff;
    } else if (input.amountOff !== undefined) {
      params.amount_off = input.amountOff;
      params.currency = normalizeCurrency(input.currency, "lowercase");
    }

    if (input.duration === "repeating" && input.durationInMonths) {
      params.duration_in_months = input.durationInMonths;
    }

    if (input.maxRedemptions) {
      params.max_redemptions = input.maxRedemptions;
    }

    const coupon = await stripe.coupons.create(params, {
      idempotencyKey: ctx.idempotencyKey,
    });

    return { data: coupon.id, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
