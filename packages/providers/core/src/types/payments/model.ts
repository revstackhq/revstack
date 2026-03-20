import { LineItem } from "@/types/catalog/model";
import { PaymentMethod } from "@/types/payment-methods/model";

/**
 * Standardized lifecycle states for a Revstack Payment.
 * Abstracts away provider-specific statuses into a unified financial state machine.
 */
export enum PaymentStatus {
  /** Payment initialized but waiting for the customer to provide payment details. */
  Pending = "pending",
  /** Payment requires customer authentication (e.g., 3D Secure / SCA). */
  RequiresAction = "requires_action",
  /** Payment is currently processing (common for asynchronous methods like ACH or SEPA). */
  Processing = "processing",
  /** Funds have been held/authorized on the customer's instrument, awaiting capture. */
  Authorized = "authorized",
  /** Payment has been successfully completed and funds are captured. */
  Succeeded = "succeeded",
  /** Payment attempt was declined or failed by the network. */
  Failed = "failed",
  /** Payment was voided or canceled prior to capture. */
  Canceled = "canceled",

  // ─── Post-Capture States ───────────────────────────────────────────────────

  /** The entire captured amount has been refunded to the customer. */
  Refunded = "refunded",
  /** A portion of the captured amount has been refunded. */
  PartiallyRefunded = "partially_refunded",
  /** The payment is currently being contested by the customer's bank (Chargeback). */
  Disputed = "disputed",
}

/**
 * Granular breakdown of the total payment amount.
 */
export interface PaymentAmountDetails {
  /** The base amount before taxes or discounts, in the smallest currency unit. */
  subtotal: number;
  /** Total tax collected. */
  tax: number;
  /** Total discount applied. */
  discount: number;
  /** Shipping costs applied, if any. */
  shipping?: number;
  /** Provider processing fees (e.g., Stripe network fees), if visible at transaction time. */
  fee?: number;
}

/**
 * The Universal Payment Entity.
 * Represents a single financial transaction record in the Revstack ecosystem.
 */
export interface Payment {
  /** Revstack internal payment ID (e.g., pay_123). */
  id: string;
  /** The provider slug handling this payment (e.g., 'stripe', 'polar', 'mercadopago'). */
  providerId: string;
  /** External provider ID (e.g., Stripe's pi_xxx). */
  externalId: string;

  /** Total amount captured, in the smallest currency unit (e.g., cents). */
  amount: number;
  /** Three-letter ISO 4217 currency code, in lowercase. */
  currency: string;
  /** The normalized operational state of the payment. */
  status: PaymentStatus;

  /** Granular breakdown of the total amount. */
  amountDetails?: PaymentAmountDetails;

  /** The total amount that has been refunded so far, in the smallest currency unit. */
  amountRefunded: number;

  /** The ID of the saved PaymentMethod used for this transaction. */
  paymentMethodId?: string;
  /** * A point-in-time snapshot of the payment instrument used.
   * Utilizes the discriminated union from the paymentMethods domain.
   */
  paymentMethodSnapshot?: PaymentMethod;

  /** Optional human-readable description for internal tracking. */
  description?: string;
  /** The dynamic text that will appear on the customer's bank statement. */
  statementDescriptor?: string;

  /** Revstack internal customer ID. */
  customerId?: string;
  /** External provider customer ID (e.g., cus_xxx). */
  externalCustomerId?: string;

  /** The provider's standardized decline code (e.g., 'insufficient_funds'). */
  failureCode?: string;
  /** Human-readable explanation of the failure provided by the network. */
  failureMessage?: string;

  /** Exact timestamp when the payment was initiated. */
  createdAt: Date;
  /** Exact timestamp of the last state mutation. */
  updatedAt?: Date;

  /** Arbitrary key-value store for custom business logic mapping. */
  metadata?: Record<string, any>;
  /** Optional list of purchased items attached to this transaction. */
  lineItems?: LineItem[];
  /** The raw JSON payload from the provider for deep auditing and debugging. */
  raw?: any;
}
