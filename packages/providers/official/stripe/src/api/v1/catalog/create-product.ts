import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  CreateProductInput,
  AsyncActionResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";
import { mapCategoryToStripeTaxCode } from "@/utils";

/**
 * Creates a new product in the provider's catalog.
 *
 * @param ctx - The provider execution context.
 * @param input - The product data (name, description, images, metadata).
 * @returns An AsyncActionResult yielding the newly created product ID.
 */
export async function createProduct(
  ctx: ProviderContext,
  input: CreateProductInput,
): Promise<AsyncActionResult<string>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);

    const stripeTaxCode = mapCategoryToStripeTaxCode(input.category);

    const product = await stripe.products.create(
      {
        name: input.name,
        description: input.description,
        images: input.images,
        active: input.active ?? true,
        tax_code: stripeTaxCode,
        metadata: {
          ...input.metadata,
          revstack_category: input.category ?? "saas",
          revstack_trace_id: ctx.traceId || null,
        },
      },
      { idempotencyKey: ctx.idempotencyKey },
    );

    return { data: product.id, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
