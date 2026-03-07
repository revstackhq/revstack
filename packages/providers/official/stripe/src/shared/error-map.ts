import { RevstackErrorCode } from "@revstackhq/providers-core";
import Stripe from "stripe";

/**
 * maps stripe error codes (error.code) to revstack error codes.
 * for new providers, replicate this file and fill in the provider-specific codes.
 */
export const ERROR_CODE_MAP: Record<string, RevstackErrorCode> = {
  // --- card / payment errors ---
  card_declined: RevstackErrorCode.CardDeclined,
  insufficient_funds: RevstackErrorCode.InsufficientFunds,
  expired_card: RevstackErrorCode.ExpiredCard,
  incorrect_cvc: RevstackErrorCode.IncorrectCvc,
  incorrect_number: RevstackErrorCode.InvalidInput,
  invalid_card_type: RevstackErrorCode.PaymentMethodNotSupported,
  processing_error: RevstackErrorCode.PaymentFailed,
  payment_intent_unexpected_state: RevstackErrorCode.InvalidState,

  // --- authentication ---
  authentication_required: RevstackErrorCode.AuthenticationRequired,

  // --- resources ---
  resource_missing: RevstackErrorCode.ResourceNotFound,
  resource_already_exists: RevstackErrorCode.ResourceAlreadyExists,

  // --- idempotency ---
  idempotency_key_in_use: RevstackErrorCode.IdempotencyKeyConflict,

  // --- amount / currency ---
  amount_too_small: RevstackErrorCode.InvalidAmount,
  amount_too_large: RevstackErrorCode.InvalidAmount,
  balance_insufficient: RevstackErrorCode.InsufficientFunds,
  currency_not_supported: RevstackErrorCode.InvalidCurrency,

  // --- payment method ---
  payment_method_not_available: RevstackErrorCode.PaymentMethodNotSupported,
  payment_method_provider_decline: RevstackErrorCode.CardDeclined,
  missing_required_param: RevstackErrorCode.MissingRequiredField,

  // --- limits ---
  card_velocity_exceeded: RevstackErrorCode.LimitExceeded,

  // --- subscriptions ---
  subscription_payment_intent_requires_action:
    RevstackErrorCode.AuthenticationRequired,

  // --- account ---
  account_closed: RevstackErrorCode.AccountSuspended,
  account_country_invalid_address: RevstackErrorCode.InvalidInput,

  // --- refunds ---
  charge_already_refunded: RevstackErrorCode.RefundAlreadyProcessed,
  charge_disputed: RevstackErrorCode.DisputeLost,
  charge_expired_for_capture: RevstackErrorCode.RefundWindowExpired,

  // --- fraud ---
  fraudulent: RevstackErrorCode.FraudDetected,

  // --- email ---
  email_invalid: RevstackErrorCode.InvalidEmail,

  StripeRateLimitError: RevstackErrorCode.RateLimitExceeded,
  StripeAuthenticationError: RevstackErrorCode.InvalidCredentials,
  StripeConnectionError: RevstackErrorCode.ProviderUnavailable,
  StripeAPIError: RevstackErrorCode.InternalError,
};

/**
 * maps stripe sdk errors to revstack error codes
 */
export function mapError(error: unknown): {
  code: RevstackErrorCode;
  message: string;
  providerError?: string;
} {
  if (error instanceof Stripe.errors.StripeError) {
    const msg = error.message;
    const stripeCode = error.code;

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
      providerError: stripeCode,
    };
  }

  return {
    code: RevstackErrorCode.UnknownError,
    message: (error as Error).message || "Unknown error",
  };
}
