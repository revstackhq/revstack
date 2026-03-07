import {
  CardDetails,
  BankTransferDetails,
  WalletDetails,
  CryptoDetails,
  MandateStatus,
  MandateType,
} from "./model";

// ─── Payment Method Payload ──────────────────────────────────────────────────

/** Base context typically available in payment method webhook events. */
interface BasePaymentMethodPayload {
  /** The external customer ID this payment method is attached to. */
  customerId?: string;
  /** Whether this method was set as the default during the event. */
  isDefault?: boolean;
}

/**
 * Payload for saved financial instrument events (e.g., PAYMENT_METHOD_ATTACHED).
 * Strictly mirrors the discriminated union pattern of the core model,
 * ensuring type safety without requiring internal DB identifiers.
 */
export type PaymentMethodPayload =
  | (BasePaymentMethodPayload & { type: "card"; details: CardDetails })
  | (BasePaymentMethodPayload & {
      type: "bank_transfer";
      details: BankTransferDetails;
    })
  | (BasePaymentMethodPayload & { type: "wallet"; details: WalletDetails })
  | (BasePaymentMethodPayload & { type: "crypto"; details: CryptoDetails })
  | (BasePaymentMethodPayload & {
      type: "pix" | "other";
      details: Record<string, any>;
    });

// ─── Mandate Payload ─────────────────────────────────────────────────────────

/**
 * Payload for mandate events, representing legal authorizations for direct debits.
 */
export interface MandatePayload {
  /** The external provider ID of the payment method this mandate authorizes. */
  paymentMethodId: string;
  /** The operational status of the mandate. */
  status: MandateStatus;
  /** Whether the mandate authorizes a one-time or recurring charge. */
  type: MandateType;
}
