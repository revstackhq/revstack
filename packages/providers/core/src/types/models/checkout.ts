import { LineItem } from "@/types/models/shared";
// CHECKOUT MODELS
// =============================================================================

export type CheckoutSessionMode = "payment" | "subscription" | "setup";
export type CheckoutSessionBillingAddressCollection = "auto" | "required";

export type CheckoutSessionInput = {
  /** revstack customer id */
  customerId?: string;
  /** fallback customer email */
  customerEmail?: string;

  /** client reference id */
  clientReferenceId?: string;

  /** enable automatic tax */
  automaticTax?: boolean;

  /** statement descriptor */
  statementDescriptor?: string;

  /** trial interval for subscription line items */
  trialInterval?: "day" | "week" | "month" | "year";
  /** trial interval count for subscription line items */
  trialIntervalCount?: number;

  /** save payment method */
  setupFutureUsage?: boolean;
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

export type CheckoutSessionResult = {
  /** external checkout session id */
  id: string;
  /** expires at iso */
  expiresAt?: string;
};

// =============================================================================
// BILLING PORTAL
// =============================================================================

export type BillingPortalInput = {
  /** external customer id */
  customerId: string;
  /** return URL after the customer leaves the portal */
  returnUrl: string;
};

export type BillingPortalResult = {
  /** portal session URL to redirect the customer to */
  url: string;
};
