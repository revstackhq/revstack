import { Interval, PricingType } from "@/types/shared";

/** Structural pricing model for a price object. */
export type PriceBillingScheme = "per_unit" | "tiered";

/**
 * Universal product taxonomy for Revstack.
 * Used internally to map to provider-specific tax codes and reporting metrics.
 */
export type ProductCategory =
  | "saas" // Software as a Service (Cloud)
  | "digital_goods" // Downloadables, eBooks, MP3s
  | "physical" // Tangible goods shipped to a customer
  | "consulting" // Professional services, hourly work
  | "education" // Online courses, coaching
  | "donations"; // Non-profit, tips

export type Product = {
  /** provider external product ID (e.g., `prod_xxx`) */
  id: string;
  /** product name */
  name: string;
  /** product category */
  category: ProductCategory;
  /** product description */
  description?: string;
  /** product images */
  images: string[];
  /** whether the product is active */
  active: boolean;
  /** creation timestamp ISO */
  createdAt: Date;
  /** custom metadata */
  metadata?: Record<string, any>;
};

export type Price = {
  /** provider external price ID (e.g., `price_xxx`) */
  id: string;
  /** product ID this price belongs to */
  productId: string;
  /** amount in smallest currency unit */
  unitAmount: number;
  /** ISO currency code */
  currency: string;
  /** "one_time" or "recurring" */
  type: PricingType;
  /** billing interval (only for recurring) */
  interval?: Interval;
  /** interval count */
  intervalCount?: number;
  /** whether the price is active */
  active: boolean;
  /** creation timestamp ISO */
  createdAt: Date;
  /** custom metadata */
  metadata?: Record<string, any>;
};

/**
 * A line item referencing a pre-existing catalog price.
 *
 * Used when the product and price have already been created on the provider
 * (e.g., via `catalog.createProduct` + `catalog.createPrice`), or when using
 * a provider that supports inline `price_data` lookup by ID.
 */
export type CatalogLineItem = {
  /** External price ID (e.g., `price_1Nxxx`). */
  priceId: string;
  /** Number of units to purchase. Defaults to 1. */
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
 * Type guard that narrows a `LineItem` to `CatalogLineItem`.
 *
 * Uses the presence of `priceId` as the discriminant — if it exists,
 * the item references a pre-registered catalog price. Otherwise, it's
 * an `AdHocLineItem` with inline pricing.
 *
 * @example
 * ```ts
 * if (isCatalogItem(item)) {
 *   // item.priceId is available
 * } else {
 *   // item.name, item.amount, item.currency are available
 * }
 * ```
 */
export function isCatalogItem(item: LineItem): item is CatalogLineItem {
  return "priceId" in item;
}
