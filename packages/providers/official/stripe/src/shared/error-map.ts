import { RevstackErrorCode } from "@revstackhq/providers-core";
import Stripe from "stripe";

export const ERROR_CODE_MAP: Record<string, RevstackErrorCode> = {
  // ===========================================================================
  // CARDS & PAYMENTS
  // ===========================================================================
  card_declined: RevstackErrorCode.CardDeclined,
  insufficient_funds: RevstackErrorCode.InsufficientFunds,
  expired_card: RevstackErrorCode.ExpiredCard,
  incorrect_cvc: RevstackErrorCode.IncorrectCvc,
  invalid_cvc: RevstackErrorCode.IncorrectCvc,
  incorrect_number: RevstackErrorCode.InvalidInput,
  invalid_number: RevstackErrorCode.InvalidInput,
  invalid_expiry_month: RevstackErrorCode.InvalidInput,
  invalid_expiry_year: RevstackErrorCode.InvalidInput,
  invalid_card_type: RevstackErrorCode.PaymentMethodNotSupported,
  card_not_supported: RevstackErrorCode.PaymentMethodNotSupported,
  processing_error: RevstackErrorCode.PaymentFailed,
  payment_intent_unexpected_state: RevstackErrorCode.InvalidState,
  setup_attempt_failed: RevstackErrorCode.PaymentFailed,

  // ===========================================================================
  // AUTHENTICATION & SECURITY (3D Secure)
  // ===========================================================================
  authentication_required: RevstackErrorCode.AuthenticationRequired,
  payment_intent_authentication_failure:
    RevstackErrorCode.AuthenticationRequired,
  setup_intent_authentication_failure: RevstackErrorCode.AuthenticationRequired,
  fraudulent: RevstackErrorCode.FraudDetected,

  // ===========================================================================
  // RESOURCES & VALIDATION
  // ===========================================================================
  resource_missing: RevstackErrorCode.ResourceNotFound,
  resource_already_exists: RevstackErrorCode.ResourceAlreadyExists,
  parameter_invalid_empty: RevstackErrorCode.InvalidInput,
  parameter_missing: RevstackErrorCode.MissingRequiredField,
  parameter_unknown: RevstackErrorCode.InvalidInput,
  email_invalid: RevstackErrorCode.InvalidEmail,
  tax_id_invalid: RevstackErrorCode.InvalidInput,
  coupon_expired: RevstackErrorCode.InvalidInput, // O RevstackErrorCode.ResourceExpired si lo tenés

  // ===========================================================================
  // IDEMPOTENCY
  // ===========================================================================
  idempotency_key_in_use: RevstackErrorCode.IdempotencyKeyConflict,

  // ===========================================================================
  // AMOUNTS & CURRENCIES
  // ===========================================================================
  amount_too_small: RevstackErrorCode.InvalidAmount,
  amount_too_large: RevstackErrorCode.InvalidAmount,
  balance_insufficient: RevstackErrorCode.InsufficientFunds,
  currency_not_supported: RevstackErrorCode.InvalidCurrency,
  currency_conversion_not_supported: RevstackErrorCode.InvalidCurrency,

  // ===========================================================================
  // PAYMENT METHODS (Wallets, Bank Transfers)
  // ===========================================================================
  payment_method_not_available: RevstackErrorCode.PaymentMethodNotSupported,
  payment_method_provider_decline: RevstackErrorCode.CardDeclined,
  missing_required_param: RevstackErrorCode.MissingRequiredField,

  // ===========================================================================
  // LIMITS & ACCOUNTS
  // ===========================================================================
  card_velocity_exceeded: RevstackErrorCode.LimitExceeded,
  customer_max_payment_methods: RevstackErrorCode.LimitExceeded,
  account_closed: RevstackErrorCode.AccountSuspended,
  account_country_invalid_address: RevstackErrorCode.InvalidInput,

  // ===========================================================================
  // SUBSCRIPTIONS & INVOICES
  // ===========================================================================
  subscription_payment_intent_requires_action:
    RevstackErrorCode.AuthenticationRequired,
  invoice_no_customer_line_items: RevstackErrorCode.InvalidState,
  invoice_already_paid: RevstackErrorCode.InvalidState,
  invoice_not_editable: RevstackErrorCode.InvalidState,
  out_of_inventory: RevstackErrorCode.InvalidState,

  // ===========================================================================
  // REFUNDS & DISPUTES
  // ===========================================================================
  charge_already_refunded: RevstackErrorCode.RefundAlreadyProcessed,
  charge_disputed: RevstackErrorCode.DisputeLost,
  charge_expired_for_capture: RevstackErrorCode.RefundWindowExpired,
};

/**
 * Maps Stripe SDK errors to Revstack error codes.
 * Catches exact network/auth error types before falling back to string codes.
 */
export function mapError(error: unknown): {
  code: RevstackErrorCode;
  message: string;
  providerError?: string;
} {
  if (error instanceof Stripe.errors.StripeError) {
    const msg = error.message;
    const stripeCode = error.code;

    if (error instanceof Stripe.errors.StripeRateLimitError) {
      return {
        code: RevstackErrorCode.RateLimitExceeded,
        message: msg,
        providerError: "rate_limit",
      };
    }
    if (error instanceof Stripe.errors.StripeAuthenticationError) {
      return {
        code: RevstackErrorCode.InvalidCredentials,
        message: msg,
        providerError: "auth_error",
      };
    }
    if (error instanceof Stripe.errors.StripeConnectionError) {
      return {
        code: RevstackErrorCode.ProviderUnavailable,
        message: msg,
        providerError: "connection_error",
      };
    }
    if (error instanceof Stripe.errors.StripeIdempotencyError) {
      return {
        code: RevstackErrorCode.IdempotencyKeyConflict,
        message: msg,
        providerError: "idempotency_error",
      };
    }

    const mappedCode = stripeCode ? ERROR_CODE_MAP[stripeCode] : undefined;

    if (mappedCode) {
      return {
        code: mappedCode,
        message: msg,
        providerError: stripeCode,
      };
    }

    return {
      code: RevstackErrorCode.UnknownError,
      message: msg,
      providerError: stripeCode || error.type,
    };
  }

  return {
    code: RevstackErrorCode.UnknownError,
    message: (error as Error).message || "Unknown unexpected error",
  };
}
