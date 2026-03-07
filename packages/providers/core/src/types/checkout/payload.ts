import {
  CheckoutSessionMode,
  CheckoutPaymentStatus,
} from "@/types/checkout/model";

/**
 * Payload for hosted checkout session events.
 */
export interface CheckoutPayload {
  /** Subtotal amount before taxes and discounts (in the smallest currency unit). */
  amountSubtotal: number;
  /** Total tax amount computed during checkout. */
  amountTax: number;
  /** Final total amount processed. */
  amountTotal: number;
  /** Three-letter ISO currency code, in lowercase. */
  currency: string;
  /** Array of applied discount or promotion IDs. */
  appliedDiscountIds: string[];
  /** The operating mode of the checkout session. */
  mode: CheckoutSessionMode;
  /** The financial status of the session. */
  paymentStatus: CheckoutPaymentStatus;
}
