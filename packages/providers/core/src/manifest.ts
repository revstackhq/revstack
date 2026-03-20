import { CurrencyCode } from "@/types/currency";
import { RegionCode } from "@/types/region";
import { ProviderCapabilities } from "@/types/capabilities";
import { ProviderCategory } from "@/types/categories";
import { PaymentMethodType } from "@/types/payment-methods";

export type ProviderStatus = "stable" | "beta" | "deprecated" | "experimental";

export type UpdatePriority = "low" | "recommended" | "critical" | "security";

export type ProviderPaginationType = "cursor" | "page";

/**
 * input UI field types
 */
export type ConfigFieldType =
  | "text"
  | "password"
  | "switch"
  | "select"
  | "number"
  | "json";

/**
 * Strategy to toggle between test and live modes.
 */
export type SandboxStrategy = "separate_credentials" | "header_flag";

/**
 * Pricing model of the provider.
 */
export type ProviderPricingModel =
  | "subscription"
  | "transactional"
  | "freemium"
  | "free";

export interface ProviderEngine {
  /**
   * required core semver range (e.g. "^1.0.0")
   */
  revstack: string;

  /**
   * optional node version limit
   */
  node?: string;
}

export interface ProviderLocalization {
  /** * Countries where the Merchant can be based to use this provider.
   * Use ["*"] for global providers (like Polar/Paddle).
   */
  merchantCountries: RegionCode[];

  /** Countries where the end-customer can be located to process payments. */
  customerCountries: RegionCode[];

  /** * Currencies that can be presented to the user at checkout (Processing).
   * Example: ["USD", "ARS", "BRL"]
   */
  processingCurrencies: CurrencyCode[];

  /** * Currencies in which the merchant receives their funds (Settlement).
   * Important for MoR like Polar which might process in many but settle in USD.
   */
  settlementCurrencies: CurrencyCode[];
}

export interface ProviderCompliance {
  /** * True if the provider acts as a Merchant of Record (MoR).
   * Revstack uses this to decide if it should trigger its own tax engine.
   */
  actsAsMoR: boolean;

  /** True if the provider handles sales tax/VAT calculation natively. */
  calculatesTaxes: boolean;

  /** Standard industry compliance (e.g., PCI-DSS Level) */
  pciLevel?: string;
}

/**
 * Internal system traits that dictate how the Core interacts with the Provider's API.
 */
export interface ProviderSystemTraits {
  /** * If false, Revstack Cloud activates the 'Stateful Idempotency Layer'
   * to prevent double charges.
   */
  hasNativeIdempotency: boolean;

  /** API velocity constraints to prevent Provider-side 429 errors. */
  rateLimits?: {
    requestsPerSecond: number;
  };

  /** Strategy to toggle between test and live modes. */
  sandboxStrategy: SandboxStrategy;
}

export interface ProviderPricing {
  /**
   * underlying provider pricing model
   */
  model: ProviderPricingModel;

  /**
   * human-readable fee text
   */
  fees?: string;

  /**
   * link to provider pricing page
   */
  url?: string;
}

export interface ProviderMedia {
  /**
   * square icon (SVG/PNG)
   */
  icon: string;

  /**
   * horizontal logo (SVG/PNG)
   */
  logo: string;

  /**
   * plugin detail hero image
   */
  banner?: string;

  /**
   * array of screenshot URLs
   */
  screenshots?: string[];
}

/**
 * config field definition for UI rendering and encryption parsing
 */
export interface SetupRequestFieldDefinition {
  /** Label to display in the UI */
  label: string;
  /** Input type */
  type: ConfigFieldType;
  /** If true, this field must be encrypted in the DB */
  secure: boolean;
  /** Is this field required? */
  required: boolean;
  /** Description or tooltip for the user */
  description?: string;
  /** Options for 'select' type */
  options?: { label: string; value: string }[];

  /**
   * Regex pattern string for validation.
   * Example: "^sk_(test|live)_[a-zA-Z0-9]+$"
   */
  pattern?: string;

  /** Custom error message if regex validation fails. */
  errorMessage?: string;
}

export interface SetupResponseFieldDefinition {
  /**
   * If true, the value of this field will be encrypted in the DB.
   */
  secure: boolean;

  /**
   * Description for internal documentation (optional)
   */
  description?: string;
}

/**
 * dashboard update visual severity
 */

export interface ProviderSetup {
  /** UI Schema for the settings dashboard (Secrets, API Keys) */
  request: Record<string, SetupRequestFieldDefinition>;

  /** Internal persistence schema for installed instances (Webhook Secrets, etc.) */
  response?: Record<string, SetupResponseFieldDefinition>;
}

/**
 * release versioning and migration plan
 */
export interface ProviderRelease {
  /**
   * Semantic version of the provider package (e.g., '1.0.0').
   * Vital for managing updates in the marketplace.
   */
  version: string;

  /**
   * Indicates if this update breaks compatibility with previous configurations.
   * - `true`: "Hard Break". The integration stops (Status: Error) until the user updates the config.
   * - `false`: "Soft Update". The integration continues working (Status: Healthy) using the old logic.
   */
  breaking: boolean;

  /**
   * The visual urgency level to display in the UI.
   * - `low`: Grey/Blue badge. (Minor bug fixes)
   * - `recommended`: Yellow badge. (New features)
   * - `critical`: Red badge. (Mandatory API changes)
   * - `security`: Flashing Red/Alert. (Vulnerabilities)
   */
  priority: UpdatePriority;

  /**
   * Short message (1-2 sentences) explaining the value of the update.
   * Example: "Adds support for partial refunds and fixes a webhook timeout issue."
   */
  message: string;

  /**
   * Optional link to a detailed migration guide.
   * Useful when the user needs to make manual changes in their Stripe/PayPal dashboard.
   */
  docsUrl?: string;

  /**
   * ISO 8601 Date when the previous version will stop working permanently.
   * Useful for "Soft Updates" that eventually become mandatory.
   * Example: "2026-12-31T23:59:59Z"
   */
  sunsetDate?: string;
}

/**
 * core provider metadata and capabilities schema
 */
export interface ProviderManifest {
  /** Unique identifier slug (e.g., 'stripe', 'polar') */
  slug: string;

  /** Human-readable display name */
  name: string;

  /** Version of the current provider package */
  version: string;

  /** Lifecycle status of the integration */
  status: ProviderStatus;

  /** Classification (e.g., Card, Wallet, MerchantOfRecord) */
  categories: ProviderCategory[];

  /** Short marketplace pitch */
  description?: string;

  /** Maintainer organization name */
  author?: string;

  /** Pricing info for the merchant */
  pricing?: ProviderPricing;

  /** * Localization rules.
   * Replaces the old top-level 'regions' and 'currencies' for better granularity.
   */
  localization: ProviderLocalization;

  /** Compliance and Tax responsibility flags */
  compliance: ProviderCompliance;

  /**
   * Supported payment methods
   */
  supportedPaymentMethods: PaymentMethodType[];

  /**
   * flags if there's a dedicated sandbox mode
   */
  sandboxAvailable?: boolean;

  /** Performance and infrastructure traits */
  systemTraits: ProviderSystemTraits;

  /**
   * Setup schema for the provider.
   */
  setup: ProviderSetup;

  /** Functional capabilities (What this provider can actually do) */
  capabilities: ProviderCapabilities;

  /** Visual assets for the Marketplace and Dashboard */
  media: ProviderMedia;

  /** External links for support and documentation */
  links: {
    dashboard?: string;
    documentation?: string;
    support?: string;
    setupGuide?: string;
    pricing?: string;
  };

  /** Update history and migration paths */
  releases?: ProviderRelease[];

  /** Technical execution requirements */
  engine: ProviderEngine;

  /** API pagination strategy for resource syncing */
  paginationType: ProviderPaginationType;

  /** If true, the provider is only visible to the owner (Private Plugin) */
  hidden?: boolean;
}
