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
 * Used for manual overage collection when `billing.paymentLinks` is true.
 */
export interface CreatePaymentLinkInput {
  /** The exact amount to collect in the smallest currency unit. */
  amount: number;
  /** The 3-letter ISO currency code. */
  currency: string;
  /** What the user is paying for (e.g., "March API Overages"). */
  description: string;
  /** Optional: Auto-fills the checkout session if the customer ID is known. */
  customerId?: string;
  /** Optional: Auto-fills the email field if the customer ID is not provided. */
  customerEmail?: string;
  /** Optional: The exact date/time when this link should expire and become unpayable. */
  expiresAt?: Date;
}
