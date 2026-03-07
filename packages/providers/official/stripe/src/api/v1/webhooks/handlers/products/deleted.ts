import { RevstackEvent , fromUnixSeconds } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toProductPayload } from "@/api/v1/products/mapper";

/** Handles a product deletion event. → PRODUCT_DELETED */
export function handleProductDeleted(raw: any): RevstackEvent | null {
  const event = raw as Stripe.ProductDeletedEvent;
  const product = event.data.object;
  return {
    type: "PRODUCT_DELETED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: product.id,
    metadata: { ...product.metadata },
    originalPayload: raw,
    data: toProductPayload(product),
  };
}
