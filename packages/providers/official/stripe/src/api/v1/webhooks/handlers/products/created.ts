import { fromUnixSeconds, WebhookHandler } from "@revstackhq/providers-core";
import type Stripe from "stripe";
import { toProductPayload } from "@/api/v1/products/mapper";

/** Handles a product creation event. → PRODUCT_CREATED */
export const handleProductCreated: WebhookHandler = async (raw, _ctx) => {
  const event = raw as Stripe.ProductCreatedEvent;
  const product = event.data.object;
  return Promise.resolve({
    type: "PRODUCT_CREATED",
    providerEventId: event.id,
    createdAt: fromUnixSeconds(event.created),
    resourceId: product.id,
    metadata: { ...product.metadata },
    originalPayload: raw,
    data: toProductPayload(product),
  });
};
