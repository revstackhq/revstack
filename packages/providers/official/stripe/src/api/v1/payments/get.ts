import { toPayment } from "./mapper";
import { mapError } from "@/shared/error-map";
import {
  ProviderContext,
  Payment,
  AsyncActionResult,
  PaymentStatus,
  GetPaymentInput,
  normalizeCurrency,
 fromUnixSeconds } from "@revstackhq/providers-core";
import { getOrCreateClient } from "@/api/v1/client";

/**
 * Retrieves a payment record by its provider ID.
 * Supports dual-mode resolution: if the ID refers to a checkout session,
 * it resolves the underlying payment intent automatically. If no payment
 * intent exists (e.g., for setup-only sessions), a synthesized Payment
 * is returned based on the session fields.
 *
 * @param ctx - The provider context instance.
 * @param input - Contains the payment or session ID to retrieve.
 * @returns An AsyncActionResult containing the normalized Revstack Payment.
 */
export async function getPayment(
  ctx: ProviderContext,
  input: GetPaymentInput,
): Promise<AsyncActionResult<Payment>> {
  const stripe = getOrCreateClient(ctx.config.apiKey);
  let id = input.id;

  try {
    if (id.startsWith("cs_")) {
      const session = await stripe.checkout.sessions.retrieve(id);

      const piId = session.payment_intent
        ? typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent.id
        : null;

      if (!piId) {
        const synthesizedPayment: Payment = {
          id: session.id,
          providerId: "stripe",
          externalId: session.id,
          amount: session.amount_total ?? 0,
          currency: session.currency
            ? normalizeCurrency(session.currency)
            : "USD",
          status:
            session.status === "expired"
              ? PaymentStatus.Canceled
              : session.payment_status === "paid"
                ? PaymentStatus.Succeeded
                : PaymentStatus.Pending,
          amountRefunded: 0,
          customerId:
            typeof session.customer === "string"
              ? session.customer
              : session.customer?.id,
          createdAt: fromUnixSeconds(session.created),
          metadata: session.metadata || undefined,
          raw: session,
        };

        return {
          data: synthesizedPayment,
          status: session.status === "open" ? "requires_action" : "success",
          nextAction:
            session.status === "open" && session.url
              ? { type: "redirect", url: session.url }
              : undefined,
        };
      }

      id = piId;
    }

    const pi = await stripe.paymentIntents.retrieve(id, {
      expand: ["latest_charge"],
    });

    return { data: toPayment(pi), status: "success" };
  } catch (error: unknown) {
    const mapped = mapError(error);
    return { data: null, status: "failed", error: mapped };
  }
}
