/**
 * Defines the user interface strategy for collecting payment details.
 * This dictates how the Revstack Frontend SDK renders the payment flow.
 */
export type CheckoutStrategy =
  /**
   * The user is redirected to a page hosted by the Provider (e.g., Stripe Checkout).
   * - **Pros:** Easiest integration, full PCI compliance offloaded to the provider.
   * - **Cons:** User leaves your domain, less control over the branding experience.
   */
  | "redirect"
  /**
   * The payment form is embedded directly in your app using the Provider's JS SDK (e.g., Stripe Elements).
   * - **Pros:** User stays on your domain, seamless UX.
   * - **Cons:** Requires handling client-side tokens and partial PCI SAQ A compliance.
   */
  | "native_sdk"
  /**
   * Server-Driven UI (SDUI). The provider returns raw JSON primitives (QR codes, Bank Instructions)
   * and Revstack renders the UI natively without external scripts.
   * - **Use Case:** Crypto payments, Bank Transfers (Pix, Boleto), or custom manual flows.
   */
  | "sdui";

/**
 * Defines who orchestrates the recurring billing scheduler, state, and invoice generation.
 */
export type SubscriptionMode =
  /**
   * The Provider acts as the Billing Engine (e.g., Stripe Billing, Polar).
   * - **Logic:** The provider handles retries, proration, and email receipts.
   * - **Role:** Revstack acts as a mirror, updating its internal state via webhooks.
   */
  | "native"
  /**
   * Revstack Core acts as the authoritative Billing Engine.
   * - **Logic:** Revstack runs the CRON scheduler and triggers "One-Time Payments" via the provider.
   * - **Use Case:** Fallback for gateways that do not support subscriptions natively.
   */
  | "virtual";

/**
 * Defines the security mechanism used to validate incoming webhook payloads.
 */
export type WebhookVerificationType =
  /** Validated via an HMAC SHA256 signature header (Gold Standard). */
  | "signature"
  /** Validated via a static shared secret token in the headers. */
  | "secret"
  /** No verification. Inherently insecure, used only for basic gateways or local testing. */
  | "none";

/**
 * Defines how overages and usage-based billing are processed by the orchestrator.
 */
export type MeteredBillingMode =
  /** * The provider has a native usage API. Revstack periodically syncs usage data
   * (e.g., using `reportUsage`), and the provider calculates the final invoice.
   */
  | "native"
  /** * The provider supports invoices but not usage tracking. Revstack calculates the
   * overage internally and injects standard line items into a pending draft invoice.
   */
  | "invoiced"
  /** * The provider is purely transactional. Revstack calculates usage and generates
   * a standalone payment link to be emailed to the customer at the end of the cycle.
   */
  | "manual";

/**
 * Defines how discount codes and promotions are handled during checkout.
 */
export type PromotionMode =
  /** * The provider evaluates the coupon natively. Revstack sends the coupon ID
   * and the provider calculates the discounted total at checkout.
   */
  | "native"
  /** * Revstack calculates the math internally and sends the final, discounted amount
   * to the provider. The provider is completely unaware that a coupon was applied.
   */
  | "virtual";

/**
 * Defines how Products and Prices (Catalog) are mapped between Revstack and the Provider.
 */
export type CatalogSyncStrategy =
  /** * Just-In-Time (JIT) Creation. Revstack must explicitly call `createProduct` and
   * `createPrice` on the provider milliseconds before initializing the checkout session.
   * - **Use Case:** Polar, PayPal, or strict catalog-driven providers.
   */
  | "jit"
  /** * Inline Pricing. The provider allows passing arbitrary, ad-hoc price data directly
   * inside the checkout payload without pre-creating catalog entities.
   * - **Use Case:** Stripe (`price_data`).
   */
  | "inline";

/**
 * A comprehensive feature-flag manifest for a Payment Provider.
 *
 * This object acts as the contract between the Provider and the Revstack Orchestration Engine.
 * It allows the Core to dynamically adapt UI behavior, billing strategies, and API fallbacks
 * based strictly on what the connected gateway actually supports.
 */
export interface ProviderCapabilities {
  /**
   * Configuration for the Checkout and Payment Form experience.
   */
  checkout: {
    /** Whether this provider offers a pre-built checkout flow. */
    supported: boolean;
    /** The integration strategy required for the frontend SDK. */
    strategy: CheckoutStrategy;
  };

  /**
   * Configuration for One-Time Transaction processing.
   */
  payments: {
    supported: boolean;
    features: {
      /** Can transactions be fully refunded? */
      refunds: boolean;
      /** Can transactions be partially refunded for a specific amount? */
      partialRefunds: boolean;
      /** Does the provider support separate Authorization and Capture steps? */
      capture: boolean;
      /** Does the provider expose dispute/chargeback lifecycle events? */
      disputes: boolean;
    };
  };

  /**
   * Configuration for Recurring Billing and Lifecycle Management.
   */
  subscriptions: {
    supported: boolean;
    /** Determines if Revstack or the Provider runs the billing scheduler. */
    mode: SubscriptionMode;
    features: {
      /** Can a subscription be temporarily halted without canceling? */
      pause: boolean;
      /** Can a paused subscription be reactivated? */
      resume: boolean;
      /** Can a subscription be canceled (immediately or at period end)? */
      cancellation: boolean;
      /** Does the provider automatically calculate pro-rata usage on upgrades/downgrades? */
      proration?: boolean;
      /** Can the subscription hold multiple line items simultaneously (e.g., Base Plan + Add-ons)? */
      multiItem: boolean;
    };
  };

  /**
   * Configuration for Usage-based Billing, Overages, and Invoicing.
   */
  billing: {
    /** The strategy Revstack will use to charge for API calls, seats, or metered usage. */
    metered: MeteredBillingMode;
    /** Can the provider generate persistent, shareable payment URLs? */
    paymentLinks: boolean;
    /** Does the provider expose a native 'Invoice' entity for B2B accounting? */
    invoices: boolean;
    /** Can Revstack inject arbitrary charges into an upcoming/draft invoice? */
    invoiceItems: boolean;
  };

  /**
   * Configuration for Discounts, Coupons, and Marketing Promotions.
   */
  promotions: {
    /** Determines if discounts are applied natively by the gateway or emulated by Revstack. */
    coupons: PromotionMode;
  };

  /**
   * Configuration for Product and Price synchronization.
   */
  catalog: {
    /** The strategy Revstack will use to ensure the provider recognizes the items being sold. */
    syncStrategy: CatalogSyncStrategy;
  };

  /**
   * Configuration for Customer Profile Management.
   */
  customers: {
    supported: boolean;
    features: {
      create: boolean;
      update: boolean;
      delete: boolean;
    };
  };

  /**
   * Configuration for Event and Webhook processing.
   */
  webhooks: {
    supported: boolean;
    /** The method Revstack must use to cryptographically verify incoming events. */
    verification: WebhookVerificationType;
  };
}
