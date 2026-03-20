/** High-level category of a saved financial instrument. */
export type PaymentMethodType =
  | "card"
  | "bank_transfer"
  | "wallet"
  | "crypto"
  | "pix"
  | "other";

/** Operational status of a mandate authorization. */
export type MandateStatus = "active" | "inactive" | "pending";

/** Authorization scope of a mandate — one-time or recurring. */
export type MandateType = "multi_use" | "single_use";

/**
 * The Universal Mandate Entity.
 * Represents a bank or direct-debit authorization that permits future charges
 * on a customer's account without further explicit approval.
 */
export interface Mandate {
  /** Revstack internal mandate ID. */
  id: string;
  /** The provider slug managing this mandate (e.g., 'stripe'). */
  providerId: string;
  /** External provider mandate ID (e.g., Stripe's mandate_xxx). */
  externalId: string;
  /** The payment method this mandate authorizes charges on. */
  paymentMethodId: string;
  /** Current operational status of the mandate. */
  status: MandateStatus;
  /** Whether this mandate permits a single charge or recurring charges. */
  type: MandateType;
  /** Exact timestamp when the mandate was created. */
  createdAt: Date;
  /** Arbitrary key-value store for custom business logic data. */
  metadata?: Record<string, any>;
  /** Raw provider payload for auditing. */
  raw?: any;
}

// ─── Instrument-Specific Details ─────────────────────────────────────────────

export interface CardDetails {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  cardholderName?: string;
}

export interface BankTransferDetails {
  bankName: string;
  last4?: string;
  routingNumber?: string;
  accountType?: string;
}

export interface WalletDetails {
  walletProvider:
    | "apple_pay"
    | "google_pay"
    | "paypal"
    | "amazon_pay"
    | "link"
    | "other";
  email?: string;
}

export interface CryptoDetails {
  network: string; // e.g., 'ethereum', 'polygon'
  walletAddress?: string;
}

// ─── The Master Union Types ──────────────────────────────────────────────────

/** Base properties shared across ALL payment methods. */
export interface BasePaymentMethod {
  /** Revstack internal payment method ID. */
  id: string;
  /** Revstack internal customer ID this method belongs to. */
  customerId: string;
  /** External provider payment method ID. */
  externalId: string;
  /** Whether this is the customer's default payment method. */
  isDefault: boolean;
  /** Custom metadata key-value store. */
  metadata?: Record<string, any>;
}

export interface CardPaymentMethod extends BasePaymentMethod {
  type: "card";
  details: CardDetails;
}

export interface BankPaymentMethod extends BasePaymentMethod {
  type: "bank_transfer";
  details: BankTransferDetails;
}

export interface WalletPaymentMethod extends BasePaymentMethod {
  type: "wallet";
  details: WalletDetails;
}

export interface CryptoPaymentMethod extends BasePaymentMethod {
  type: "crypto";
  details: CryptoDetails;
}

export interface GenericPaymentMethod extends BasePaymentMethod {
  type: "pix" | "other";
  details: Record<string, any>; // Catch-all for uncharted instruments
}

/**
 * The Universal Payment Method Abstraction.
 * TypeScript will automatically narrow the `details` shape based on the `type`.
 */
export type PaymentMethod =
  | CardPaymentMethod
  | BankPaymentMethod
  | WalletPaymentMethod
  | CryptoPaymentMethod
  | GenericPaymentMethod;
