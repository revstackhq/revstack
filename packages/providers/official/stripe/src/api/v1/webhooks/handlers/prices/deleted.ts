import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toPricePayload } from "@/api/v1/prices/mapper";

/** Handles a price deletion event. → PRICE_DELETED */
export const handlePriceDeleted: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.PriceDeletedEvent;
  const price = event.data.object;
  return Promise.resolve({
    type: "PRICE_DELETED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: price.id,
    metadata: { ...price.metadata },
    originalPayload: raw,
    data: toPricePayload(price),
  });
};
