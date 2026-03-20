import { Product } from "@polar-sh/sdk/models/components/product.js";
import {
  ProductPayload,
  ProductMapper,
  ProductCategory,
  fromUnixSeconds,
} from "@revstackhq/providers-core";

/**
 * Empty ProductMapper for scaffolding. Replace with actual entity fields when needed.
 */
export const toProduct: ProductMapper = (raw) => {
  const product = raw as Product;

  const category: ProductCategory =
    (product.metadata?.revstack_category as ProductCategory) ?? "saas";

  return {
    id: product.id,
    createdAt: new Date(product.createdAt),
    images: product.medias?.map((media) => media.publicUrl) ?? [],
    name: product.name,
    description: product.description ?? undefined,
    active: product.visibility === "public",
    category,
    metadata: product.metadata,
    providerId: "polar",
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
  const product = raw as Product;
  return {
    name: product.name,
    description: product.description ?? undefined,
    active: product.visibility === "public",
  };
}
