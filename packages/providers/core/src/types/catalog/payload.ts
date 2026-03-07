import { Interval, PricingType } from "@/types/shared";
import { PriceBillingScheme } from "@/types/catalog/model";

/**
 * Payload for product catalog events.
 * Mirrors the relevant fields from the Product model for event context.
 */
export interface ProductPayload {
  /** The commercial name of the product. */
  name: string;
  /** A brief description of the product. */
  description?: string;
  /** Whether the product is currently active and available for purchase. */
  active: boolean;
}

/**
 * Payload for price catalog events.
 * Mirrors the relevant fields from the Price model for event context.
 */
export interface PricePayload {
  /** The ID of the product this price is associated with. */
  productId: string;
  /** The unit amount in the smallest currency unit. */
  unitAmount: number;
  /** Three-letter ISO currency code, in lowercase. */
  currency: string;
  /** Whether this price is currently active. */
  active: boolean;
  /** Whether this is a one-time purchase or a recurring charge. */
  type: PricingType;
  /** The structural pricing model: flat-rate or tiered/graduated. */
  billingScheme: PriceBillingScheme;
  /** The recurring billing interval (applicable only when type is 'recurring'). */
  interval?: Interval;
  /** The number of intervals between subscription billings. */
  intervalCount?: number;
}
