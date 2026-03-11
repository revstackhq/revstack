import { LineItem } from "@/types/catalog";
import {
  CheckoutSessionBillingAddressCollection,
  CheckoutSessionMode,
} from "@/types/checkout/model";
import { Interval } from "@/types/shared";

export type CheckoutSessionInput = {
  /** revstack customer id */
  customerId?: string;
  /** fallback customer email */
  customerEmail?: string;

  /** client reference id */
  clientReferenceId?: string;

  /** statement descriptor */
  statementDescriptor?: string;

  /** trial interval for subscription line items */
  trialInterval?: Interval;
  /** trial interval count for subscription line items */
  trialIntervalCount?: number;

  /** Save payment method for future use */
  savePaymentMethod?: boolean;

  /** currency */
  currency?: string;

  /** checkout line items */
  lineItems: LineItem[];
  /** success url */
  successUrl?: string;
  /** cancel url */
  cancelUrl?: string;
  /** return url */
  returnUrl?: string;
  /** billing address collection mode */
  billingAddressCollection?: CheckoutSessionBillingAddressCollection;
  /** checkout mode */
  mode: CheckoutSessionMode;

  /** automatically apply a specific provider promotion code ID */
  promotionCodeId?: string;
  /** allow promo codes input box on the hosted checkout */
  allowPromotionCodes?: boolean;

  /** custom metadata */
  metadata?: Record<string, any>;
};

/**
 * Input parameters for generating a standalone, shareable payment URL.
 *
 * Uses the polymorphic `LineItem` type so both catalog references and
 * inline ad-hoc charges can be collected through a single payment link.
 * The tuple syntax `[LineItem, ...LineItem[]]` enforces at least one item.
 */
export interface CreatePaymentLinkInput {
  /** The items to charge for in this link */
  lineItems: [LineItem, ...LineItem[]];

  /** Optional: Auto-fills the checkout session if the customer ID is known. */
  customerId?: string;
  /** Optional: Auto-fills the email field if the customer ID is not provided. */
  customerEmail?: string;

  /** URL where the customer will be redirected after a successful payment. */
  successUrl?: string;
  /** URL where the customer will be redirected if they click "Back" or cancel. */
  returnUrl?: string;

  /** Allow promo codes input box on the hosted checkout */
  allowPromotionCodes?: boolean;
  /** Automatically apply a specific provider promotion code ID */
  promotionCodeId?: string;

  /** Trial interval for subscription line items */
  trialInterval?: Interval;
  /** Trial interval count for subscription line items */
  trialIntervalCount?: number;

  /** Optional label to distinguish links internally in the provider dashboard */
  label?: string;

  /** Optional: The exact date/time when this link should expire. (Supported by Stripe, emulated/ignored in others) */
  expiresAt?: Date;
  /** Custom metadata for the link itself */
  metadata?: Record<string, any>;
}
