import {
  PriceBillingScheme,
  PricingTier,
  ProductCategory,
} from "@/types/catalog/model";
import { PaginationOptions, Interval } from "@/types/shared";

export type CreateProductInput = {
  /** product name */
  name: string;
  /** product description */
  description?: string;
  /** * The universal Revstack product category.
   * Providers will map this to their native tax codes internally.
   */
  category?: ProductCategory;
  /** product images */
  images?: string[];
  /** whether the product is active */
  active?: boolean;
  /** custom metadata */
  metadata?: Record<string, any>;
};

export interface CreatePriceInput {
  /** The ID of the parent product in the provider's system */
  productId: string;

  /** The mathematical model this price follows */
  billingScheme: PriceBillingScheme;

  /** The cost in the smallest currency unit (cents) */
  unitAmount: number;

  /** 3-letter ISO 4217 currency code */
  currency: string;

  /** Whether the price is active and available for new checkouts */
  active?: boolean;

  /** Key-value store for custom business logic */
  metadata?: Record<string, any>;

  // --- RECURRING PROPERTIES ---
  /** The frequency of billing. Required for recurring prices. */
  interval?: Interval;
  /** The number of intervals between billings. Defaults to 1. */
  intervalCount?: number;

  // --- METERED PROPERTIES ---
  /** * The ID of the meter IN THE PROVIDER'S SYSTEM.
   * Required by some providers (like Polar) when creating metered prices.
   */
  meterId?: string;

  // --- CUSTOM PROPERTIES ---
  /** The minimum amount allowed for a 'custom' / pay-what-you-want price */
  minimumAmount?: number;

  // --- TIERED PROPERTIES ---
  /** * Array of tiers for volume or graduated pricing.
   * Required when billingScheme is 'tiered_volume' or 'tiered_graduated'.
   */
  tiers?: PricingTier[];
}

export type GetProductInput = { id: string };

export type DeleteProductInput = { id: string };

export type UpdateProductInput = Partial<CreateProductInput> & { id: string };

export interface ListProductsOptions extends PaginationOptions {
  filters?: Record<string, any>;
}

export type GetPriceInput = { id: string };

export interface ListPricesOptions extends PaginationOptions {
  productId: string;
  filters?: Record<string, any>;
}
