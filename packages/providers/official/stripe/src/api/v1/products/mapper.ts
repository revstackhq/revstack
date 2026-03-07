import Stripe from "stripe";
import {
  ProductPayload,
  ProductMapper,
  fromUnixSeconds,
} from "@revstackhq/providers-core";

/**
 * Empty ProductMapper for scaffolding. Replace with actual entity fields when needed.
 */
export const toProduct: ProductMapper = (raw) => {
  return {
    id: raw.id,
    createdAt: fromUnixSeconds(raw.created),
    images: raw.images,
    name: raw.name,
    description: raw.description ?? undefined,
    active: raw.active,
    metadata: raw.metadata,
    providerId: "stripe",
    raw,
  };
};

/**
 * Extracts a minimal ProductPayload from a raw provider product object
 * for use inside webhook event emissions.
 *
 * @param raw - The raw product object from a webhook event body.
 * @returns A ProductPayload for use in RevstackEvent.data.
 */
export function toProductPayload(raw: any): ProductPayload {
  const product = raw as Stripe.Product;
  return {
    name: product.name,
    description: product.description ?? undefined,
    active: product.active,
  };
}
