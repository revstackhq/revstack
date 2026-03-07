import { RevstackEvent , fromUnixSeconds } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toPricePayload } from "@/api/v1/prices/mapper";

/** Handles a price update event. → PRICE_UPDATED */
export function handlePriceUpdated(raw: any): RevstackEvent | null {
  const event = raw as Stripe.PriceUpdatedEvent;
  const price = event.data.object;
  return {
    type: "PRICE_UPDATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: price.id,
    metadata: { ...price.metadata },
    originalPayload: raw,
    data: toPricePayload(price),
  };
}
