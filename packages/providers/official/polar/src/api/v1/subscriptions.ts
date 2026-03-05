import { getOrCreatePolar } from "@/api/v1/client";
import { mapPolarSubscriptionToSubscription } from "@/api/v1/mappers";
import {
  AsyncActionResult,
  CreateSubscriptionInput,
  PaginatedResult,
  ProviderContext,
  Subscription,
  RevstackErrorCode,
  CheckoutSessionResult,
  buildPagePagination,
  UpdateSubscriptionInput,
  CheckoutSessionInput,
  CustomLineItem,
  GetSubscriptionInput,
  CancelSubscriptionInput,
  PauseSubscriptionInput,
  ResumeSubscriptionInput,
  ListSubscriptionsOptions,
} from "@revstackhq/providers-core";

import { resolveJitProductId } from "@/utils/jit";
import { mapError } from "@/shared/error-map";
import { SubscriptionUpdate } from "@polar-sh/sdk/models/components/subscriptionupdate.js";

/**
 * Defers Polar subscription creation safely to a checkout session.
 *
 * @param ctx - The provider context.
 * @param input - The explicit subscription input limits.
 * @param createCheckoutSession - Subjugated checkout function hook.
 * @returns A result yielding the redirect URL or checkout session.
 */
export async function createSubscription(
  ctx: ProviderContext,
  input: CreateSubscriptionInput,
  createCheckoutSession: (
    ctx: ProviderContext,
    input: CheckoutSessionInput,
  ) => Promise<AsyncActionResult<CheckoutSessionResult>>,
): Promise<AsyncActionResult<string>> {
  try {
    const polar = getOrCreatePolar(ctx);

    const lineItems = input.lineItems as CustomLineItem[];

    const totalAmount = lineItems.reduce(
      (acc, item) => acc + item.amount * (item.quantity || 1),
      0,
    );

    const bundleName = lineItems
      .map((i) => `${i.quantity || 1}x ${i.name}`)
      .join(" + ");

    const baseInterval = lineItems[0]?.interval;

    const bundlePriceId = await resolveJitProductId(polar, ctx, {
      jit: {
        name: bundleName,
        amount: totalAmount,
        currency: lineItems[0]?.currency || "usd",
        interval: baseInterval,
        description: "Consolidated subscription bundle",
        trialInterval: lineItems[0]?.trialInterval,
        trialIntervalCount: lineItems[0]?.trialIntervalCount,
      },
    });

    const result = await createCheckoutSession(ctx, {
      mode: "subscription",
      ...input,
      lineItems: [{ priceId: bundlePriceId, quantity: 1 }],
      metadata: {
        ...input.metadata,
        order_id: input.clientReferenceId,
      },
    });

    return {
      data: result.data?.id || null,
      status: result.status,
      nextAction: result.nextAction,
      error: result.error,
    };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}

/**
 * Fetches an active comprehensive subscription from Polar.
 *
 * @param ctx - The provider context.
 * @param id - The active subscription ID.
 * @returns The cleanly mapped Revstack subscription.
 */
export async function getSubscription(
  ctx: ProviderContext,
  input: GetSubscriptionInput,
): Promise<AsyncActionResult<Subscription>> {
  try {
    const polar = getOrCreatePolar(ctx);
    const sub = await polar.subscriptions.get({ id: input.id });
    return {
      data: mapPolarSubscriptionToSubscription(sub),
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
}

/**
 * Gracefully cancels an active Polar subscription.
 *
 * @param ctx - The provider context.
 * @param id - The active subscription ID.
 * @param _reason - Unused cancellation description.
 * @returns The ID of the cancelled subscription.
 */
export async function cancelSubscription(
  ctx: ProviderContext,
  input: CancelSubscriptionInput,
): Promise<AsyncActionResult<string>> {
  try {
    const polar = getOrCreatePolar(ctx);

    const update: SubscriptionUpdate = input.immediate
      ? { revoke: true }
      : { cancelAtPeriodEnd: true };

    const sub = await polar.subscriptions.update({
      id: input.id,
      subscriptionUpdate: update,
    });

    return {
      data: sub.id,
      status: "success",
    };
  } catch (error: any) {
    if (error.status === 404) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.SubscriptionNotFound,
          message: error.message,
          providerError: error.name,
        },
      };
    }
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
}

/**
 * Pauses a Polar subscription. Returns a NotImplemented error.
 *
 * @param _ctx - Unused provider context.
 * @param _id - Unused ID.
 * @returns A NotImplemented Error.
 */
export async function pauseSubscription(
  _ctx: ProviderContext,
  _input: PauseSubscriptionInput,
): Promise<AsyncActionResult<string>> {
  return {
    data: null,
    status: "failed",
    error: {
      code: RevstackErrorCode.NotImplemented,
      message: "Polar does not natively support pausing subscriptions yet.",
    },
  };
}

/**
 * Resumes a Polar subscription. Returns a NotImplemented error.
 *
 * @param _ctx - Unused provider context.
 * @param _id - Unused ID.
 * @returns A NotImplemented Error.
 */
export async function resumeSubscription(
  _ctx: ProviderContext,
  _input: ResumeSubscriptionInput,
): Promise<AsyncActionResult<string>> {
  return {
    data: null,
    status: "failed",
    error: {
      code: RevstackErrorCode.NotImplemented,
      message: "Polar does not natively support resuming paused subscriptions.",
    },
  };
}

/**
 * Lists multiple paginated subscriptions dynamically correctly.
 *
 * @param ctx - The provider context.
 * @param pagination - Generic depth limits.
 * @param filters - Query filters.
 * @returns A paginated array of mapped subscriptions.
 */
export async function listSubscriptions(
  ctx: ProviderContext,
  options: ListSubscriptionsOptions,
): Promise<AsyncActionResult<PaginatedResult<Subscription>>> {
  try {
    const polar = getOrCreatePolar(ctx);
    const targetPage =
      options.page ||
      (options.startingAfter && parseInt(options.startingAfter) + 1) ||
      (options.endingBefore &&
        Math.max(1, parseInt(options.endingBefore) - 1)) ||
      1;

    const subsResponse = await polar.subscriptions.list({
      organizationId: ctx.config.organizationId,
      limit: options.limit || 10,
      page: targetPage,
      ...options.filters,
    });

    return {
      data: buildPagePagination(
        subsResponse.result.items,
        targetPage,
        subsResponse.result.pagination.maxPage,
        mapPolarSubscriptionToSubscription,
      ),
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError) {
      return { data: null, status: "failed", error: error.errorPayload };
    }
    return { data: null, status: "failed", error: mapError(error) };
  }
}

/**
 * Replaces the product configuration for an active Polar subscription.
 *
 * @param ctx - The provider context.
 * @param id - The ID of the subscription.
 * @param input - The update payload with the new price ID.
 * @returns The successfully updated subscription ID.
 */
export async function updateSubscription(
  ctx: ProviderContext,
  input: UpdateSubscriptionInput,
): Promise<AsyncActionResult<string>> {
  try {
    const polar = getOrCreatePolar(ctx);

    const mainItem = input.lineItems?.find((item: any) => "priceId" in item);

    if (!mainItem || !("priceId" in mainItem) || !mainItem.priceId) {
      return {
        data: null,
        status: "failed",
        error: {
          code: RevstackErrorCode.InvalidInput,
          message:
            "Polar requires a valid Price ID in line items for subscription updates.",
        },
      };
    }

    const sub = await polar.subscriptions.update({
      id: input.id,
      subscriptionUpdate: {
        prorationBehavior: input.proration === "none" ? "invoice" : "prorate",
        productId: mainItem.priceId,
      },
    });

    return {
      data: sub.id,
      status: "success",
    };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
