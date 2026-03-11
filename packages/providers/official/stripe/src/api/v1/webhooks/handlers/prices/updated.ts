import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toPricePayload } from "@/api/v1/prices/mapper";

/** Handles a price update event. → PRICE_UPDATED */
export const handlePriceUpdated: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.PriceUpdatedEvent;
  const price = event.data.object;
  return Promise.resolve({
    type: "PRICE_UPDATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: price.id,
    metadata: { ...price.metadata },
    originalPayload: raw,
    data: toPricePayload(price),
  });
};
