export type CheckoutSessionMode = "payment" | "subscription" | "setup";
export type CheckoutSessionBillingAddressCollection = "auto" | "required";

/** Financial status of a checkout session. */
export type CheckoutPaymentStatus = "paid" | "unpaid" | "no_payment_required";

/** Lifecycle status of a checkout session. */
export type CheckoutStatus = "open" | "complete" | "expired";

export type CheckoutSessionResult = {
  /** external checkout session id */
  id: string;
  /** expires at iso */
  expiresAt?: Date;
};

/**
 * The Universal Checkout Session Entity.
 * Represents the full record of a checkout flow initiated for a customer.
 * Distinct from CheckoutSessionResult, which is only the redirect handshake DTO.
 */
export interface CheckoutSession {
  /** Revstack internal checkout session ID. */
  id: string;
  /** The provider slug handling this session (e.g., 'stripe'). */
  providerId: string;
  /** External provider session ID (e.g., Stripe's cs_xxx). */
  externalId: string;
  /** The internal customer ID this session belongs to. */
  customerId?: string;
  /** The operational mode of this session. */
  mode: CheckoutSessionMode;
  /** The lifecycle status of the session. */
  status: CheckoutStatus;
  /** The financial collection status of the session. */
  paymentStatus: CheckoutPaymentStatus;
  /** The URL the customer is redirected to after completing the session. */
  successUrl?: string;
  /** The URL the customer is redirected to if they abandon the session. */
  cancelUrl?: string;
  /** The URL of the Stripe-hosted payment page. Null after session ends. */
  url?: string;
  /** The external payment intent ID linked to this session. */
  paymentIntentId?: string;
  /** The external subscription ID created via this session. */
  subscriptionId?: string;
  /** An opaque reference passed through for client-side reconciliation. */
  clientReferenceId?: string;
  /** Total amount collected, in the smallest currency unit. */
  amountTotal?: number;
  /** Three-letter ISO 4217 currency code. */
  currency?: string;
  /** Exact timestamp when the session expires. */
  expiresAt: Date;
  /** Exact timestamp when the session was created. */
  createdAt: Date;
  /** Arbitrary key-value store for custom business logic data. */
  metadata?: Record<string, any>;
  /** Raw provider payload for auditing. */
  raw?: any;
}
