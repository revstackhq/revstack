import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  DeleteProductInput,
  AsyncActionResult,
} from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Deactivates (archives) a product in the provider's catalog.
 * Stripe does not truly delete products; this sets `active: false`.
 *
 * @param ctx - The provider execution context.
 * @param input - Contains the product ID to deactivate.
 * @returns An AsyncActionResult indicating success.
 */
export async function deleteProduct(
  ctx: ProviderContext,
  input: DeleteProductInput,
): Promise<AsyncActionResult<boolean>> {
  try {
    const stripe = getOrCreateClient(ctx.config.apiKey);
    await stripe.products.update(input.id, { active: false });

    return { data: true, status: "success" };
  } catch (error: any) {
    if (error.isRevstackError)
      return { data: null, status: "failed", error: error.errorPayload };
    return { data: null, status: "failed", error: mapError(error) };
  }
}
