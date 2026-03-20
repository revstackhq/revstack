import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  CreateCouponInput,
  AsyncActionResult,
  normalizeCurrency,
  RevstackError,
  RevstackErrorCode,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { DiscountCreate } from "@polar-sh/sdk/models/components/discountcreate.js";

export async function createCoupon(
  ctx: ProviderContext,
  input: CreateCouponInput,
): Promise<AsyncActionResult<string>> {
  try {
    const polar = getOrCreateClient(ctx.config.apiKey);

    if (!input.code) {
      throw new RevstackError({
        code: RevstackErrorCode.InvalidInput,
        message: "Coupon code is required.",
      });
    }

    if (input.amountOff !== undefined && !input.currency) {
      throw new RevstackError({
        code: RevstackErrorCode.InvalidInput,
        message: "Currency is required for fixed amount discounts.",
      });
    }

    let params: DiscountCreate;

    const isRepeating = input.duration === "repeating";
    const common = {
      name: input.code,
      code: input.code,
      duration: input.duration,
      maxRedemptions: input.maxRedemptions,
      organizationId: ctx.config.organizationId,
      ...(isRepeating && { durationInMonths: input.durationInMonths || 1 }),
    };

    if (input.percentOff !== undefined) {
      const basisPoints = Math.round(input.percentOff * 100);

      params = {
        ...common,
        type: "percentage",
        basisPoints,
      } as DiscountCreate;
    } else if (input.amountOff !== undefined) {
      params = {
        ...common,
        type: "fixed",
        amount: input.amountOff,
        currency: normalizeCurrency(input.currency || "USD", "lowercase"),
      } as DiscountCreate;
    } else {
      throw new RevstackError({
        code: RevstackErrorCode.InvalidInput,
        message: "Either percentOff or amountOff must be provided.",
      });
    }

    const coupon = await polar.discounts.create(params, {
      integrity: ctx.idempotencyKey,
    });

    return { data: coupon.id, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null as any, status: "failed", error: error.errorPayload };
    return { data: null as any, status: "failed", error: mapError(error) };
  }
}
