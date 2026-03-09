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

export type CatalogLineItem = {
  /** external price id (e.g., price_1Nxxx) */
  priceId: string;
  /** quantity to purchase */
  quantity: number;
};

export type LineItem = CatalogLineItem;
