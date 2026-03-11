import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toPricePayload } from "@/api/v1/prices/mapper";

/** Handles a price creation event. → PRICE_CREATED */
export const handlePriceCreated: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.PriceCreatedEvent;
  const price = event.data.object;
  return Promise.resolve({
    type: "PRICE_CREATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: price.id,
    metadata: { ...price.metadata },
    originalPayload: raw,
    data: toPricePayload(price),
  });
};
