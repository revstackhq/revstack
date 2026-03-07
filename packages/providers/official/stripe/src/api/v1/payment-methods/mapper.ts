import Stripe from "stripe";
import {
  PaymentMethod,
  PaymentMethodMapper,
  PaymentMethodPayload,
} from "@revstackhq/providers-core";

/**
 * Maps a raw provider payment method object into the unified Revstack PaymentMethod
 * discriminated union. Routes to the correct instrument-specific branch based on type,
 * normalizing card, bank account, and wallet data into their respective typed shapes.
 *
 * TypeScript narrows the `details` shape automatically based on the `type` discriminant.
 *
 * @param raw - The raw payment method object from Stripe.
 * @param defaultId - The ID of the default payment method (typically from the customer object).
 * @returns A normalized Revstack core PaymentMethod model.
 */
export const toPaymentMethod: PaymentMethodMapper = (
  raw,
  defaultId?: string | null,
) => {
  const rawObject = raw as Stripe.PaymentMethod;

  // Properties shared across all instrument types
  const base = {
    id: rawObject.id,
    customerId:
      typeof rawObject.customer === "string"
        ? rawObject.customer
        : rawObject.customer?.id || "",
    externalId: rawObject.id,
    isDefault: !!defaultId && rawObject.id === defaultId,
    metadata: rawObject.metadata || {},
  };

  // Route to the correct discriminated union branch based on the instrument type
  switch (rawObject.type) {
    case "card":
      return {
        ...base,
        type: "card",
        details: {
          brand: rawObject.card?.brand || "unknown",
          last4: rawObject.card?.last4 || "****",
          expMonth: rawObject.card?.exp_month || 0,
          expYear: rawObject.card?.exp_year || 0,
          cardholderName: rawObject.billing_details?.name || undefined,
        },
      };

    // Regional bank-debit networks unified under the bank_transfer abstraction
    case "us_bank_account":
    case "sepa_debit":
    case "bacs_debit":
      return {
        ...base,
        type: "bank_transfer",
        details: {
          bankName: rawObject.us_bank_account?.bank_name || "Unknown Bank",
          last4:
            rawObject.us_bank_account?.last4 ||
            rawObject.sepa_debit?.last4 ||
            "****",
        },
      };

    // Digital wallets with distinct customer-facing identifiers
    case "paypal":
    case "link":
      return {
        ...base,
        type: "wallet",
        details: {
          walletProvider: rawObject.type === "paypal" ? "paypal" : "link",
          email: rawObject.billing_details?.email || undefined,
        },
      };

    // Digital wallets without distinct customer-facing identifiers
    case "cashapp":
    case "alipay":
    case "wechat_pay":
      return {
        ...base,
        type: "wallet",
        details: { walletProvider: "other" },
      };

    // Catch-all for any unrecognized or newly added instrument types
    default:
      return {
        ...base,
        type: "other",
        // Attempt to surface the nested instrument-specific data object by its type key
        details: (rawObject as Record<string, any>)[rawObject.type] || {},
      } as PaymentMethod;
  }
};

/**
 * Extracts a strictly typed PaymentMethodPayload from a raw provider payment method object
 * for use inside webhook event emissions.
 * * Architecturally reuses the core `toPaymentMethod` normalization logic to guarantee
 * 100% parity between webhook payloads and database models without duplicating code.
 *
 * @param raw - The raw payment method object.
 * @returns A discriminated PaymentMethodPayload for use in RevstackEvent.data.
 */
export function toPaymentMethodPayload(raw: any): PaymentMethodPayload {
  const pm = toPaymentMethod(raw);

  const { id, externalId, metadata, ...payloadContext } = pm;

  return payloadContext as PaymentMethodPayload;
}
