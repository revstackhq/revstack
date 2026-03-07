import { RevstackEvent , fromUnixSeconds } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toPricePayload } from "@/api/v1/prices/mapper";

/** Handles a price deletion event. → PRICE_DELETED */
export function handlePriceDeleted(raw: any): RevstackEvent | null {
  const event = raw as Stripe.PriceDeletedEvent;
  const price = event.data.object;
  return {
    type: "PRICE_DELETED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: price.id,
    metadata: { ...price.metadata },
    originalPayload: raw,
    data: toPricePayload(price),
  };
}
