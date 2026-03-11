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
  | "embedded"
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
 * Defines the **Rating Engine** strategy for Pay-As-You-Go (PAYG) and metered billing.
 *
 * The "Rating Engine" is the system responsible for converting raw usage events
 * (e.g., "user made 500 API calls") into a monetary charge on an invoice.
 * Different providers expose different primitives, so the orchestrator must
 * adapt the collection strategy accordingly.
 *
 * @remarks
 * The chosen strategy directly determines which `BillingClient` methods the
 * provider **MUST** implement. See each member's JSDoc for the contract.
 */
export type MeteredBillingStrategy =
  /**
   * **Provider is the Rating Engine.**
   *
   * Revstack streams raw usage events to the provider's native metering API
   * (e.g., Stripe `billing.meterEvents.create`). The provider aggregates,
   * rates, and appends the resulting charges to the subscription invoice
   * automatically at cycle end.
   *
   * - **Provider MUST implement:** `ingestEvent` (and optionally `createMeter`
   *   if `requiresMeterCreation` is `true`).
   * - **Revstack role:** Event relay — no math, no invoice manipulation.
   */
  | "native_events"
  /**
   * **Revstack is the Rating Engine; provider handles invoicing.**
   *
   * Revstack calculates the monetary amount internally and injects standard
   * line items into the provider's draft invoice before it finalizes at cycle end.
   * Requires the provider to support draft invoices and `addInvoiceItem`.
   *
   * - **Provider MUST implement:** `invoices.addItem`, `invoices.create`.
   * - **Revstack role:** Calculates usage × unit price, injects line items.
   */
  | "invoiced_line_items"
  /**
   * **Revstack is the Rating Engine; charges a vaulted payment method directly.**
   *
   * Revstack calculates the total overage and creates a one-time payment
   * against the customer's stored payment method. No invoice entity involved.
   *
   * - **Provider MUST implement:** `payments.create`.
   * - **Revstack role:** Calculates total, triggers a standalone charge.
   */
  | "direct_charge"
  /**
   * **Revstack is the Rating Engine; generates a payment link (Grace Period flow).**
   *
   * Revstack calculates the total overage and generates a payment link URL
   * that is emailed to the customer. Payment is collected asynchronously.
   * Used as the last-resort fallback for gateways with no vaulting or invoicing.
   *
   * - **Provider MUST implement:** `checkout.createPaymentLink`.
   * - **Revstack role:** Calculates total, generates link, sends email.
   */
  | "manual_link";

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
   *
   * This section defines the metered billing strategy and the set of billing
   * primitives the provider exposes. The orchestrator uses these flags to
   * determine the correct PAYG collection flow at runtime.
   */
  billing: {
    /**
     * The strategy the orchestrator will use to collect usage-based charges.
     *
     * This is the single most important billing decision: it tells Revstack
     * whether the **provider** or **Revstack** acts as the Rating Engine,
     * and which payment primitive (events, invoice items, charges, or links)
     * is used to settle the balance.
     */
    meteredStrategy: MeteredBillingStrategy;

    /**
     * Granular feature flags for billing primitives.
     *
     * Each flag maps to a concrete provider API capability. The orchestrator
     * uses these, in combination with `meteredStrategy`, to validate that the
     * provider can actually fulfill the configured billing flow.
     */
    features: {
      /**
       * Can the provider generate persistent, shareable payment URLs?
       *
       * When `true`, the `checkout.createPaymentLink` method is available.
       * Required when `meteredStrategy` is `"manual_link"`.
       */
      paymentLinks: boolean;

      /**
       * Does the provider expose a native "Invoice" entity for B2B accounting?
       *
       * When `true`, the `invoices.create` and `invoices.get` methods are available.
       * Required when `meteredStrategy` is `"invoiced_line_items"`.
       */
      invoices: boolean;

      /**
       * Can Revstack inject arbitrary charge line items into an upcoming/draft invoice?
       *
       * When `true`, the `invoices.addItem` method is available.
       * Required when `meteredStrategy` is `"invoiced_line_items"`.
       */
      invoiceItems: boolean;

      /**
       * Can the provider natively receive and aggregate raw usage events?
       *
       * When `true`, the provider **MUST** implement `billing.ingestEvent`.
       * Required when `meteredStrategy` is `"native_events"`.
       */
      ingestsEvents: boolean;

      /**
       * Does the provider require explicit "Meter" / "Metric" registration
       * before usage events can be ingested?
       *
       * When `true`, the provider **MUST** implement `billing.createMeter`.
       * Only relevant when `ingestsEvents` is also `true`.
       *
       * @example Stripe requires `billing.meters.create` before `meterEvents.create`.
       */
      requiresMeterCreation: boolean;
    };
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
