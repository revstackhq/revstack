/**
 * Payload for events related to single payment transactions (Payment Intents).
 */
export interface PaymentPayload {
  /** The base amount charged before taxes (in the smallest currency unit, e.g., cents). */
  amountSubtotal: number;
  /** The total tax amount collected. */
  amountTax: number;
  /** The final total amount charged to the customer's instrument. */
  amountTotal: number;
  /** Three-letter ISO currency code, in lowercase (e.g., 'usd', 'eur'). */
  currency: string;
  /** The provider's ID for the payment method used. */
  paymentMethodId?: string;
  /** The reason provided by the network if the payment was declined. */
  failureReason?: string;
}
