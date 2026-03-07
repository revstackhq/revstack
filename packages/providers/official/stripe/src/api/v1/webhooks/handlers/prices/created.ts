import { RevstackEvent, fromUnixSeconds } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toPricePayload } from "@/api/v1/prices/mapper";

/** Handles a price creation event. → PRICE_CREATED */
export function handlePriceCreated(raw: any): RevstackEvent | null {
  const event = raw as Stripe.PriceCreatedEvent;
  const price = event.data.object;
  return {
    type: "PRICE_CREATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: price.id,
    metadata: { ...price.metadata },
    originalPayload: raw,
    data: toPricePayload(price),
  };
}
