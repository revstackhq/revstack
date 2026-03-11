import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toSubscriptionPayload } from "@/api/v1/subscriptions/mapper";

/**
 * Handles a trial expiry warning event.
 * Emitted a fixed number of days before a trial period ends,
 * giving merchants time to prompt users to add a payment method.
 * Maps to: SUBSCRIPTION_TRIAL_WILL_END
 */
export const handleSubscriptionTrialWillEnd: WebhookHandler = async (
  raw,
  _ctx,
) => {
  const event = raw as Stripe.CustomerSubscriptionTrialWillEndEvent;
  const sub = event.data.object;

  const data = toSubscriptionPayload(sub);

  return Promise.resolve({
    type: "SUBSCRIPTION_TRIAL_WILL_END",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: sub.id,
    customerId:
      typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
    metadata: { ...sub.metadata },
    originalPayload: raw,
    data,
  });
};
