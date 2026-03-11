import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toProductPayload } from "@/api/v1/products/mapper";

/** Handles a product update event. → PRODUCT_UPDATED */
export const handleProductUpdated: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.ProductUpdatedEvent;
  const product = event.data.object;
  return Promise.resolve({
    type: "PRODUCT_UPDATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: product.id,
    metadata: { ...product.metadata },
    originalPayload: raw,
    data: toProductPayload(product),
  });
};
