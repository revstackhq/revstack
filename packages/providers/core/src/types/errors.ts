/**
 * Comprehensive catalog of standardized errors for Revstack Core.
 * Grouped by domain to facilitate handling in the Frontend and API layer.
 */
export const RevstackErrorCode = {
  // --- 1. GENERIC & SYSTEM ---
  InvalidTrial: "invalid_trial",
  UnsupportedInterval: "unsupported_interval",
  UnknownError: "unknown_error",
  InternalError: "internal_error",
  NotImplemented: "not_implemented", // Optional feature not supported by a specific provider
  Timeout: "timeout",
  ServiceUnavailable: "service_unavailable", // Core system is down or maintenance mode
  RateLimitExceeded: "rate_limit_exceeded", // Revstack API rate limit hit
  QuotaExceeded: "quota_exceeded", // Merchant exceeded their active subscriptions plan limit

  // --- 2. AUTHENTICATION & CONFIG ---
  InvalidCredentials: "invalid_credentials", // Wrong API Key / Secret
  Unauthorized: "unauthorized", // User/Merchant does not have permission
  MisconfiguredProvider: "misconfigured_provider", // Missing required fields in dashboard
  AccountSuspended: "account_suspended", // Merchant account at Stripe/PayPal is blocked or restricted

  // --- 3. INPUT VALIDATION ---
  InvalidInput: "invalid_input", // Generic validation failure
  MissingRequiredField: "missing_required_field",
  InvalidEmail: "invalid_email",
  InvalidAmount: "invalid_amount", // Negative, zero, or incorrect precision
  InvalidCurrency: "invalid_currency", // Provider does not support this ISO code
  CurrencyMismatch: "currency_mismatch", // Trying to refund USD transaction with EUR
  InvalidState: "invalid_state", // e.g. Trying to "Capture" a payment that is already "Succeeded"

  // --- 4. RESOURCES (CRUD) ---
  ResourceNotFound: "resource_not_found",
  ResourceAlreadyExists: "resource_already_exists",
  IdempotencyKeyConflict: "idempotency_key_conflict", // Same key, different payload

  // --- 5. TRANSACTIONS (PAYMENTS) ---
  PaymentFailed: "payment_failed", // Generic downstream failure
  CardDeclined: "card_declined", // Bank rejected the card
  InsufficientFunds: "insufficient_funds",
  ExpiredCard: "expired_card",
  IncorrectCvc: "incorrect_cvc",
  PaymentMethodMissing: "payment_method_missing", // Trying to charge without a source
  PaymentMethodNotSupported: "payment_method_not_supported", // e.g. Amex not allowed
  AuthenticationRequired: "authentication_required", // SCA / 3D Secure required
  LimitExceeded: "limit_exceeded", // Velocity limit or card limit
  DuplicateTransaction: "duplicate_transaction",
  FraudDetected: "fraud_detected", // Blocked by fraud detection (Stripe Radar, etc.)
  PaymentMethodExpired: "payment_method_expired", // Stored payment method expired (renewal failures)

  // --- 6. SUBSCRIPTIONS ---
  SubscriptionNotFound: "subscription_not_found",
  SubscriptionAlreadyActive: "subscription_already_active",
  SubscriptionPaused: "subscription_paused", // Cannot perform action because it is paused
  SubscriptionCancelled: "subscription_cancelled", // Cannot perform action because it is canceled
  PlanNotFound: "plan_not_found",

  // --- 7. DISPUTES & REFUNDS ---
  RefundFailed: "refund_failed",
  RefundAlreadyProcessed: "refund_already_processed",
  RefundWindowExpired: "refund_window_expired", // Outside the refund time window
  DisputeLost: "dispute_lost",

  // --- 8. PROVIDER SPECIFIC ---
  ProviderUnavailable: "provider_unavailable", // Downstream API (Stripe/Polar) is down
  ProviderRejected: "provider_rejected", // Provider refused connection (e.g. High Risk)
  ProviderRateLimitExceeded: "provider_rate_limit_exceeded", // Provider blocked the request due to velocity

  // --- 9. WEBHOOKS ---
  WebhookSignatureVerificationFailed: "webhook_signature_verification_failed",
  InvalidWebhookSignature: "invalid_webhook_signature",
  InvalidWebhookPayload: "invalid_webhook_payload",

  // --- 10. PROMOTIONS ---
  InvalidPromoCode: "invalid_promo_code",
  PromoCodeExpired: "promo_code_expired",

  // --- 11. LIFECYCLE EXPIRY ---
  ResourceExpired: "resource_expired", // Coupon, payment link, or promo code has expired
  TrialExpired: "trial_expired", // Free trial period has ended without conversion
} as const;

export type RevstackErrorCode =
  (typeof RevstackErrorCode)[keyof typeof RevstackErrorCode];

/**
 * Custom Error Structure.
 * Extends native 'Error' to maintain stack traces and allow 'instanceof RevstackError'.
 */
export class RevstackError extends Error {
  public readonly code: RevstackErrorCode;
  public readonly provider?: string; // Provider slug (e.g., 'stripe')
  public readonly statusCode: number; // Suggested HTTP Status Code for API responses
  public readonly documentationUrl?: string;

  constructor(opts: {
    code: RevstackErrorCode;
    message: string;
    provider?: string;
    cause?: unknown;
    documentationUrl?: string;
  }) {
    // Utilize ES2022 native error cause chaining
    super(opts.message, { cause: opts.cause });

    // Essential for 'instanceof' to work correctly in TypeScript when targeting ES5/ES6
    Object.setPrototypeOf(this, RevstackError.prototype);
    this.name = "RevstackError";

    this.code = opts.code;
    this.provider = opts.provider;
    this.documentationUrl = opts.documentationUrl;
    this.statusCode = this.mapToStatusCode(opts.code);
  }

  /**
   * Maps internal error codes to standard HTTP Status Codes.
   * This allows the API to respond correctly without extra logic in controllers.
   */
  private mapToStatusCode(code: RevstackErrorCode): number {
    switch (code) {
      // 400 Bad Request
      case RevstackErrorCode.PaymentFailed: // Business failure, not server error
      case RevstackErrorCode.CardDeclined:
      case RevstackErrorCode.InsufficientFunds:
      case RevstackErrorCode.ExpiredCard:
      case RevstackErrorCode.IncorrectCvc:
      case RevstackErrorCode.PaymentMethodMissing:
      case RevstackErrorCode.PaymentMethodNotSupported:
      case RevstackErrorCode.RefundFailed:
      case RevstackErrorCode.RefundAlreadyProcessed:
      case RevstackErrorCode.RefundWindowExpired:
        return 400;

      // 401 Unauthorized
      case RevstackErrorCode.InvalidCredentials:
      case RevstackErrorCode.Unauthorized:
      case RevstackErrorCode.WebhookSignatureVerificationFailed:
        return 401;

      // 402 Payment Required (Specific for SCA/3DS flows or limit reached)
      case RevstackErrorCode.AuthenticationRequired:
      case RevstackErrorCode.QuotaExceeded:
        return 402;

      // 403 Forbidden
      case RevstackErrorCode.AccountSuspended:
      case RevstackErrorCode.ProviderRejected:
      case RevstackErrorCode.FraudDetected:
        return 403;

      // 404 Not Found
      case RevstackErrorCode.ResourceNotFound:
      case RevstackErrorCode.SubscriptionNotFound:
      case RevstackErrorCode.PlanNotFound:
        return 404;

      // 409 Conflict (State Machine Violations)
      case RevstackErrorCode.ResourceAlreadyExists:
      case RevstackErrorCode.IdempotencyKeyConflict:
      case RevstackErrorCode.SubscriptionAlreadyActive:
      case RevstackErrorCode.InvalidState:
      case RevstackErrorCode.SubscriptionCancelled:
        return 409;

      // 422 Unprocessable Entity (Semantic errors)
      case RevstackErrorCode.InvalidInput:
      case RevstackErrorCode.MissingRequiredField:
      case RevstackErrorCode.InvalidEmail:
      case RevstackErrorCode.InvalidAmount:
      case RevstackErrorCode.InvalidCurrency:
      case RevstackErrorCode.CurrencyMismatch:
      case RevstackErrorCode.MisconfiguredProvider:
      case RevstackErrorCode.InvalidPromoCode:
      case RevstackErrorCode.PromoCodeExpired:
        return 422;

      // 410 Gone (Expired resources)
      case RevstackErrorCode.ResourceExpired:
      case RevstackErrorCode.TrialExpired:
        return 410;

      // 429 Too Many Requests
      case RevstackErrorCode.RateLimitExceeded:
      case RevstackErrorCode.ProviderRateLimitExceeded:
        return 429;

      // 501 Not Implemented
      case RevstackErrorCode.NotImplemented:
        return 501;

      // 502 Bad Gateway (Upstream error)
      case RevstackErrorCode.ProviderUnavailable:
      case RevstackErrorCode.Timeout:
        return 502;

      // 503 Service Unavailable (System error)
      case RevstackErrorCode.ServiceUnavailable:
        return 503;

      // 500 Internal Server Error (Default fallback)
      default:
        return 500;
    }
  }

  /**
   * Helper to ensure custom properties are serialized when sending via JSON/Network.
   */
  public toJSON(): RevstackErrorResponse {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      provider: this.provider,
      documentationUrl: this.documentationUrl,
      // We exclude 'cause' in production to avoid leaking sensitive stack traces
      cause: process.env.NODE_ENV === "development" ? this.cause : undefined,
    };
  }
}

/**
 * Factory helper for functional compatibility or quick error generation.
 */
export function createError(
  code: RevstackErrorCode,
  message: string,
  provider?: string,
  cause?: unknown,
  documentationUrl?: string,
): RevstackError {
  return new RevstackError({
    code,
    message,
    provider,
    cause,
    documentationUrl,
  });
}

/**
 * Type Guard to check if an error is an instance of RevstackError.
 */
export function isRevstackError(error: unknown): error is RevstackError {
  return error instanceof RevstackError;
}

export interface RevstackErrorResponse {
  name: string;
  message: string;
  code: RevstackErrorCode;
  statusCode: number;
  provider?: string;
  documentationUrl?: string;
  cause?: unknown;
}
