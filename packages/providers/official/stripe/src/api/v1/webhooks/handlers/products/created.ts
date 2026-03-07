import { RevstackEvent , fromUnixSeconds } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toProductPayload } from "@/api/v1/products/mapper";

/** Handles a product creation event. → PRODUCT_CREATED */
export function handleProductCreated(raw: any): RevstackEvent | null {
  const event = raw as Stripe.ProductCreatedEvent;
  const product = event.data.object;
  return {
    type: "PRODUCT_CREATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: product.id,
    metadata: { ...product.metadata },
    originalPayload: raw,
    data: toProductPayload(product),
  };
}
