import { getOrCreateClient } from "@/api/v1/client";
import { toPaymentMethod } from "./mapper";
import { mapError } from "@/shared/error-map";
import {
  AsyncActionResult,
  PaymentMethod,
  ProviderContext,
  ListPaymentMethodsOptions,
} from "@revstackhq/providers-core";
import Stripe from "stripe";

/**
 * Lists all saved payment methods for a given customer.
 * Resolves the customer's default payment method in a single parallel
 * request and flags it accordingly in the returned collection.
 *
 * @param ctx - The provider context.
 * @param options - Contains the customer ID and optional filters.
 * @returns An AsyncActionResult yielding the full list of normalized PaymentMethod objects.
 */
export async function listPaymentMethods(
  ctx: ProviderContext,
  options: ListPaymentMethodsOptions,
): Promise<AsyncActionResult<PaymentMethod[]>> {
  const stripe = getOrCreateClient(ctx.config.apiKey);

  try {
    const [paymentMethods, customer] = await Promise.all([
      stripe.paymentMethods.list({ customer: options.customerId, limit: 100 }),
      stripe.customers.retrieve(options.customerId),
    ]);

    if (customer.deleted) throw new Error("Customer deleted");

    const defaultPaymentMethodId =
      (customer as Stripe.Customer).invoice_settings?.default_payment_method ||
      (customer as Stripe.Customer).default_source;

    const mappedMethods = paymentMethods.data.map((pm) =>
      toPaymentMethod(pm, defaultPaymentMethodId as string),
    );

    return { data: mappedMethods, status: "success" };
  } catch (error: unknown) {
    const mapped = mapError(error);
    return { data: [], status: "failed", error: mapped };
  }
}
