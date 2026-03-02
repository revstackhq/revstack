import { ProviderContext, RevstackErrorCode } from "@revstackhq/providers-core";
import { currencyMap } from "@/shared/currency-map";
import { PresentmentCurrency } from "@polar-sh/sdk/models/components/presentmentcurrency.js";
import { Polar } from "@polar-sh/sdk";

/**
 * Automatically resolves or creates a Just-In-Time (JIT) product and price.
 * Provides a provider-agnostic utility for both one-time payments and subscriptions.
 *
 * @param client - The authenticated client.
 * @param ctx - The provider context explicitly containing the organization config.
 * @param params - The specific dynamic inputs containing JIT information or standard Price ID.
 * @returns The resolved standard product ID
 */
export async function resolveJitProductId(
  client: Polar,
  ctx: ProviderContext,
  params: {
    priceId?: string;
    jit: {
      name: string;
      description?: string;
      interval?: string;
      amount: number;
      currency: string;
    };
  },
): Promise<string> {
  let needsCreation = !params.priceId;

  if (params.priceId) {
    try {
      await client.products.get({ id: params.priceId });
    } catch (err: any) {
      if (err.status === 404) needsCreation = true;
      else throw err;
    }
  }

  if (!needsCreation) return params.priceId!;

  if (params.jit.interval) {
    if (params.jit.interval === "day" || params.jit.interval === "week") {
      throw {
        isRevstackError: true,
        errorPayload: {
          code: RevstackErrorCode.InvalidInput,
          message: "Polar only supports 'month' or 'year' for subscriptions.",
        },
      };
    }
  }

  const newProduct = await client.products.create({
    name: params.jit.name,
    description: params.jit.description,
    organizationId: ctx.config.organizationId,
    recurringInterval: params.jit.interval || undefined,
    prices: [
      {
        amountType: "fixed",
        priceAmount: params.jit.amount,
        priceCurrency: currencyMap[
          params.jit.currency.toLowerCase() as keyof typeof currencyMap
        ] as PresentmentCurrency,
      },
    ],
  });

  return newProduct.id;
}
