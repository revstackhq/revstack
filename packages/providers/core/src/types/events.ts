import { PaymentPayload } from "@/types/payments/payload";
import { RefundPayload } from "@/types/refunds/payload";
import { DisputePayload } from "@/types/disputes/payload";
import { CheckoutPayload } from "@/types/checkout/payload";
import { SubscriptionPayload } from "@/types/subscriptions/payload";
import { InvoicePayload } from "@/types/invoices/payload";
import { CustomerPayload } from "@/types/customers/payload";
import {
  PaymentMethodPayload,
  MandatePayload,
} from "@/types/paymentMethods/payload";
import { ProductPayload, PricePayload } from "@/types/catalog/payload";

// Re-export all payload types so consumers can import them from this central file.
export type {
  PaymentPayload,
  RefundPayload,
  DisputePayload,
  CheckoutPayload,
  SubscriptionPayload,
  InvoicePayload,
  CustomerPayload,
  PaymentMethodPayload,
  MandatePayload,
  ProductPayload,
  PricePayload,
};

/**
 * Master dictionary of all standardized Revstack event types.
 * Acts as the "universal translator" between provider-specific webhooks
 * (Stripe, Polar, PayPal) and the internal state machine.
 */
export type EventType =
  // ── Payments (Direct Transactions) ──────────────────────────────────────────
  | "PAYMENT_CREATED"
  | "PAYMENT_AUTHORIZED"
  | "PAYMENT_CAPTURED"
  | "PAYMENT_PROCESSING"
  | "PAYMENT_SUCCEEDED"
  | "PAYMENT_FAILED"
  | "PAYMENT_CANCELED"

  // ── Refunds ──────────────────────────────────────────────────────────────────
  | "REFUND_CREATED"
  | "REFUND_PROCESSED"
  | "REFUND_FAILED"

  // ── Disputes (Chargebacks) ───────────────────────────────────────────────────
  | "DISPUTE_CREATED"
  | "DISPUTE_UPDATED"
  | "DISPUTE_WON"
  | "DISPUTE_LOST"

  // ── Checkouts (Hosted Payment Sessions) ─────────────────────────────────────
  | "CHECKOUT_CREATED"
  | "CHECKOUT_COMPLETED"
  | "CHECKOUT_EXPIRED"
  | "CHECKOUT_CANCELED"

  // ── Subscriptions (Recurring Billing Engine) ─────────────────────────────────
  | "SUBSCRIPTION_CREATED"
  | "SUBSCRIPTION_UPDATED"
  | "SUBSCRIPTION_RENEWED"
  | "SUBSCRIPTION_PAST_DUE"
  | "SUBSCRIPTION_CANCELED"
  | "SUBSCRIPTION_REVOKED"
  | "SUBSCRIPTION_PAUSED"
  | "SUBSCRIPTION_RESUMED"
  | "SUBSCRIPTION_TRIAL_WILL_END"

  // ── Invoices (B2B & Billing Documents) ──────────────────────────────────────
  | "INVOICE_CREATED"
  | "INVOICE_FINALIZED"
  | "INVOICE_PAID"
  | "INVOICE_PAYMENT_FAILED"
  | "INVOICE_VOIDED"
  | "INVOICE_UNCOLLECTIBLE"

  // ── Customers & Instruments (Vault) ─────────────────────────────────────────
  | "CUSTOMER_CREATED"
  | "CUSTOMER_UPDATED"
  | "CUSTOMER_DELETED"
  | "PAYMENT_METHOD_ATTACHED"
  | "PAYMENT_METHOD_UPDATED"
  | "PAYMENT_METHOD_DETACHED"
  | "MANDATE_CREATED"
  | "MANDATE_REVOKED"

  // ── Catalog (Product & Price Synchronization) ────────────────────────────────
  | "PRODUCT_CREATED"
  | "PRODUCT_UPDATED"
  | "PRODUCT_DELETED"
  | "PRICE_CREATED"
  | "PRICE_UPDATED"
  | "PRICE_DELETED";

/**
 * Master dictionary that maps an EventType string literal to its corresponding payload interface.
 * Enables strict discriminated unions and IDE autocompletion on `event.data`.
 */
export interface EventPayloadMap {
  // Payments
  PAYMENT_CREATED: PaymentPayload;
  PAYMENT_AUTHORIZED: PaymentPayload;
  PAYMENT_CAPTURED: PaymentPayload;
  PAYMENT_PROCESSING: PaymentPayload;
  PAYMENT_SUCCEEDED: PaymentPayload;
  PAYMENT_FAILED: PaymentPayload;
  PAYMENT_CANCELED: PaymentPayload;

  // Refunds
  REFUND_CREATED: RefundPayload;
  REFUND_PROCESSED: RefundPayload;
  REFUND_FAILED: RefundPayload;

  // Disputes
  DISPUTE_CREATED: DisputePayload;
  DISPUTE_UPDATED: DisputePayload;
  DISPUTE_WON: DisputePayload;
  DISPUTE_LOST: DisputePayload;

  // Checkouts
  CHECKOUT_CREATED: CheckoutPayload;
  CHECKOUT_COMPLETED: CheckoutPayload;
  CHECKOUT_EXPIRED: CheckoutPayload;
  CHECKOUT_CANCELED: CheckoutPayload;

  // Subscriptions
  SUBSCRIPTION_CREATED: SubscriptionPayload;
  SUBSCRIPTION_UPDATED: SubscriptionPayload;
  SUBSCRIPTION_RENEWED: SubscriptionPayload;
  SUBSCRIPTION_PAST_DUE: SubscriptionPayload;
  SUBSCRIPTION_CANCELED: SubscriptionPayload;
  SUBSCRIPTION_REVOKED: SubscriptionPayload;
  SUBSCRIPTION_PAUSED: SubscriptionPayload;
  SUBSCRIPTION_RESUMED: SubscriptionPayload;
  SUBSCRIPTION_TRIAL_WILL_END: SubscriptionPayload;

  // Invoices
  INVOICE_CREATED: InvoicePayload;
  INVOICE_FINALIZED: InvoicePayload;
  INVOICE_PAID: InvoicePayload;
  INVOICE_PAYMENT_FAILED: InvoicePayload;
  INVOICE_VOIDED: InvoicePayload;
  INVOICE_UNCOLLECTIBLE: InvoicePayload;

  // Customers & Instruments
  CUSTOMER_CREATED: CustomerPayload;
  CUSTOMER_UPDATED: CustomerPayload;
  CUSTOMER_DELETED: CustomerPayload;
  PAYMENT_METHOD_ATTACHED: PaymentMethodPayload;
  PAYMENT_METHOD_UPDATED: PaymentMethodPayload;
  PAYMENT_METHOD_DETACHED: PaymentMethodPayload;
  MANDATE_CREATED: MandatePayload;
  MANDATE_REVOKED: MandatePayload;

  // Catalog
  PRODUCT_CREATED: ProductPayload;
  PRODUCT_UPDATED: ProductPayload;
  PRODUCT_DELETED: ProductPayload;
  PRICE_CREATED: PricePayload;
  PRICE_UPDATED: PricePayload;
  PRICE_DELETED: PricePayload;
}

/**
 * Base properties that every Revstack event must carry, regardless of type.
 * Acts as the standardized envelope for webhook processing.
 */
export interface BaseRevstackEvent<T extends EventType> {
  /** The normalized event type used for routing (e.g., 'PAYMENT_SUCCEEDED'). */
  type: T;

  /** The provider's unique ID for this event — used for idempotency checks. */
  providerEventId: string;

  /** The exact timestamp when the provider originally emitted the event. */
  createdAt: Date;

  /** The primary ID of the underlying resource affected by this event (e.g., pi_123, sub_456). */
  resourceId: string;

  /** The provider's customer ID, used to map the event to an account without extra lookups. */
  customerId?: string;

  /** Flexible dictionary for injected metadata or tracing information. */
  metadata?: Record<string, any>;

  /** The unaltered raw JSON payload received from the provider (useful for auditing). */
  originalPayload: any;

  /**
   * The strictly-typed payload containing the financial/operational details of the event.
   * Its shape is determined by the `type` property (discriminated union).
   */
  data: EventPayloadMap[T];
}

/**
 * The final RevstackEvent type — a discriminated union of all possible event shapes.
 * Narrowing via `event.type === "PAYMENT_SUCCEEDED"` guarantees `event.data` is `PaymentPayload`.
 */
export type RevstackEvent = {
  [K in EventType]: BaseRevstackEvent<K>;
}[EventType];

/**
 * The standard response expected by the provider to acknowledge a processed webhook.
 */
export interface WebhookResponse {
  /** HTTP status code (usually 200). */
  statusCode: number;
  /** Response body (often empty or provider-specific). */
  body: any;
}

/** A handler function that processes a raw provider webhook payload into a RevstackEvent. */
export type WebhookEventHandler = (raw: any) => RevstackEvent | null;
