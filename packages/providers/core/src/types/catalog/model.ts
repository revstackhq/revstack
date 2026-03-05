// =============================================================================
// CATALOG MODELS — Products & Prices
// =============================================================================

export type Product = {
  /** provider external product ID (e.g., `prod_xxx`) */
  id: string;
  /** product name */
  name: string;
  /** product description */
  description?: string;
  /** product images */
  images: string[];
  /** whether the product is active */
  active: boolean;
  /** creation timestamp ISO */
  createdAt: string;
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
  type: "one_time" | "recurring";
  /** billing interval (only for recurring) */
  interval?: "day" | "week" | "month" | "year";
  /** interval count */
  intervalCount?: number;
  /** whether the price is active */
  active: boolean;
  /** creation timestamp ISO */
  createdAt: string;
  /** custom metadata */
  metadata?: Record<string, any>;
};
