import { Interval, PricingType } from "@/types/shared";

/**
 * Universal product taxonomy for Revstack.
 * Used internally to map to provider-specific tax codes and reporting metrics.
 *
 * @remarks
 * Providers that act as Merchants of Record (MoR) like Polar or Paddle use these
 * categories to automatically calculate the correct global VAT or Sales Tax.
 */
export type ProductCategory =
  | "saas" // Software as a Service (Cloud subscriptions)
  | "digital_goods" // Downloadables, eBooks, MP3s, one-time software licenses
  | "physical" // Tangible goods shipped to a customer (requires shipping address)
  | "consulting" // Professional services, hourly work, bespoke development
  | "education" // Online courses, coaching, webinars
  | "donations"; // Non-profit contributions, tips, pay-what-you-want support

/**
 * Represents the abstraction of a sellable good or service in the Revstack ecosystem.
 *
 * @remarks
 * A Product does not have a price or a billing cycle by itself. It serves as the
 * parent container for one or more `Price` entities.
 */
export type Product = {
  /** The unique ID assigned by the payment provider (e.g., `prod_abc123`) */
  id: string;
  /** The commercial, human-readable name of the product */
  name: string;
  /** The global taxonomy category used for tax calculation and analytics */
  category: ProductCategory;
  /** A detailed explanation of the product's value proposition or features */
  description?: string;
  /** An array of URLs pointing to promotional images or logos for the product */
  images: string[];
  /** Indicates if the product is currently visible and available for new purchases */
  active: boolean;
  /** ISO 8601 timestamp indicating when the product was first created */
  createdAt: Date;
  /** Key-value store for storing Revstack-specific or Agent-specific custom data */
  metadata?: Record<string, any>;
};

/**
 * The strict mathematical billing models supported by the Revstack Engine.
 *
 * @remarks
 * This union dictates how the final invoice amount is calculated. Providers
 * must interpret these schemes and map them to their closest native representation.
 */
export type PriceBillingScheme =
  | "flat" // A fixed recurring or one-time fee, regardless of usage.
  | "per_unit" // A fixed fee multiplied by the quantity purchased (e.g., standard seats).
  | "tiered_volume" // Pricing scales based on quantity. ALL units cost the price of the final tier reached.
  | "tiered_graduated" // Pricing scales based on quantity. Units are charged progressively across tiers (like income tax).
  | "metered" // Post-paid usage billing. Quantity is determined at the end of the billing cycle.
  | "custom" // "Pay what you want" model with an optional minimum threshold.
  | "free"; // $0 cost, often used to capture payment mandates without an initial charge.

/**
 * Defines the boundaries and costs of a single step within a tiered pricing model.
 */
export type PricingTier = {
  /** The inclusive lower bound of units for this tier. */
  minUnits: number;
  /** The inclusive upper bound of units for this tier. Null implies infinity (e.g., 100+ units). */
  maxUnits?: number | null;
  /** The cost per individual unit falling within this tier. */
  unitAmount: number;
  /** An optional fixed fee applied once if the user reaches this tier (useful for "Base fee + usage" models). */
  flatAmount?: number;
};

/**
 * The base structure that all Price variants must inherit from.
 * Enforces consistency across the entire Revstack ecosystem.
 */
interface BasePrice {
  /** The unique ID assigned by the payment provider (e.g., `price_xyz789`) */
  id: string;
  /** The ID of the parent `Product` this price is attached to. */
  productId: string;
  /** Three-letter ISO 4217 currency code in lowercase (e.g., "usd", "eur"). */
  currency: string;
  /** Indicates if this price is currently available for new subscriptions/checkouts. */
  active: boolean;
  /** Defines the lifecycle of the charge: a single transaction or an ongoing subscription. */
  type: PricingType;
  /** The frequency of billing (e.g., "month", "year"). Required if type is "recurring". */
  interval?: Interval;
  /** The number of intervals between billings (e.g., interval="month", count=3 means Quarterly). */
  intervalCount?: number;
  /** ISO 8601 timestamp indicating when the price was created. */
  createdAt: Date;
  /** Key-value store for custom business logic. */
  metadata?: Record<string, any>;
  /** Optional cosmetic label for the frontend UI to display what a unit represents (e.g., "seat", "API call"). */
  unitLabel?: string;
}

/** Represents a fixed-cost pricing structure (e.g., $99/mo standard SaaS plan). */
export interface FlatPrice extends BasePrice {
  billingScheme: "flat";
  /** The exact cost in the smallest currency unit (e.g., cents). */
  unitAmount: number;
}

/** Represents a linear scaling pricing structure (e.g., $10 per seat). */
export interface PerUnitPrice extends BasePrice {
  billingScheme: "per_unit";
  /** The cost of a single unit. Total cost = unitAmount * quantity. */
  unitAmount: number;
}

/** Represents complex volume or graduated discount pricing structures. */
export interface TieredPrice extends BasePrice {
  billingScheme: "tiered_volume" | "tiered_graduated";
  /** The ordered list of tiers defining the pricing scale. */
  tiers: PricingTier[];
}

export interface MeteredPrice extends BasePrice {
  billingScheme: "metered";
  /** The cost per unit consumed. */
  unitAmount: number;
}

/** Represents flexible, user-defined pricing (e.g., donations or pay-what-you-want). */
export interface CustomPrice extends BasePrice {
  billingScheme: "custom";
  /** The absolute minimum amount required to process the transaction, if any. */
  minimumAmount?: number;
}

/** Represents a price with no cost, useful for $0 trials or capturing payment methods. */
export interface FreePrice extends BasePrice {
  billingScheme: "free";
}

/**
 * A Discriminated Union representing all possible pricing models in Revstack.
 *
 * @remarks
 * This strict type forces developers to implement the correct mathematical
 * logic based on the `billingScheme` property, preventing invalid state combinations
 * (e.g., trying to access `tiers` on a flat price).
 */
export type Price =
  | FlatPrice
  | PerUnitPrice
  | TieredPrice
  | MeteredPrice
  | CustomPrice
  | FreePrice;

/**
 * A line item referencing a pre-existing catalog price.
 *
 * Used when the product and price have already been created on the provider
 * (e.g., via `catalog.createProduct` + `catalog.createPrice`), or when using
 * a provider that supports inline `price_data` lookup by ID.
 */
export type CatalogLineItem = {
  /** External provider price ID (e.g., `price_1Nxxx`). */
  priceId: string;
  /** Number of units to purchase. Must be mapped by the Provider to the correct native construct (like seats). Defaults to 1. */
  quantity?: number;
};

/**
 * An inline, ad-hoc line item with pricing defined at call-time.
 *
 * Used when the charge doesn't correspond to a pre-registered catalog price.
 * Common use cases: overage charges, one-off adjustments, dynamic usage fees.
 *
 * If `interval` is provided, the line item is treated as a recurring charge
 * (e.g., a usage-based add-on billed monthly).
 */
export type AdHocLineItem = {
  /** Human-readable name of the product or charge (e.g., "API Overage Charge"). */
  name: string;
  /** Exact amount in the smallest currency unit (cents). */
  amount: number;
  /** 3-letter ISO 4217 currency code (e.g., "usd", "eur"). */
  currency: string;
  /** Longer description for the line item, shown on invoices and receipts. */
  description?: string;
  /** Number of units. Defaults to 1. */
  quantity?: number;
  /**
   * Billing interval. If provided, this line item represents a recurring charge.
   * Omit for one-time charges.
   */
  interval?: Interval;
  /** Number of intervals between billings (e.g., `3` with `interval: "month"` = every 3 months). */
  intervalCount?: number;
};

/**
 * A polymorphic line item that can represent either a catalog reference
 * or an inline ad-hoc charge.
 *
 * Provider adapters use the `isCatalogItem` type guard to determine which
 * mapping path to follow (price ID lookup vs. inline `price_data`).
 */
export type LineItem = CatalogLineItem | AdHocLineItem;

/**
 * Type guard that narrows a `LineItem` to a `CatalogLineItem`.
 *
 * Uses the presence of `priceId` as the discriminant — if it exists,
 * the item references a pre-registered catalog price. Otherwise, it's
 * an `AdHocLineItem` with inline pricing.
 *
 * @example
 * ```ts
 * if (isCatalogItem(item)) {
 * // item.priceId is available
 * } else {
 * // item.name, item.amount, item.currency are available
 * }
 * ```
 */
export function isCatalogItem(item: LineItem): item is CatalogLineItem {
  return "priceId" in item;
}
