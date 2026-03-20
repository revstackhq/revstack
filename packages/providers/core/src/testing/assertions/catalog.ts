import { expect } from "vitest";
import type { Product, Price } from "@/types/catalog/model";

const VALID_PRICE_TYPES = new Set(["one_time", "recurring"]);
const VALID_CATEGORIES = new Set([
  "saas",
  "digital_goods",
  "physical",
  "consulting",
  "education",
  "donations",
]);
const VALID_BILLING_SCHEMES = new Set([
  "flat",
  "per_unit",
  "tiered_volume",
  "tiered_graduated",
  "metered",
  "custom",
  "free",
]);

/**
 * Asserts that a Product entity conforms to the Revstack canonical catalog model.
 */
export function assertProductShape(product: Product): void {
  expect(product, "Product must be defined").toBeDefined();
  expect(typeof product.id).toBe("string");
  expect(product.id.length).toBeGreaterThan(0);
  expect(typeof product.name).toBe("string");
  expect(product.name.length).toBeGreaterThan(0);
  expect(typeof product.active).toBe("boolean");
  expect(Array.isArray(product.images)).toBe(true);

  expect(
    VALID_CATEGORIES.has(product.category),
    `category "${product.category}" is not a valid ProductCategory`,
  ).toBe(true);

  // ─── DDD Temporal Contract ─────────────────────────────────────────────────
  expect(product.createdAt, "createdAt must be a native Date").toBeInstanceOf(
    Date,
  );
  expect(isNaN(product.createdAt.getTime()), "createdAt must be valid").toBe(
    false,
  );
}

/**
 * Asserts that a Price entity conforms to the polymorphic Revstack catalog model.
 */
export function assertPriceShape(price: Price): void {
  expect(price, "Price must be defined").toBeDefined();

  // 1. Assert Base Properties (Shared across all price types)
  expect(typeof price.id).toBe("string");
  expect(price.id.length).toBeGreaterThan(0);
  expect(typeof price.productId).toBe("string");
  expect(typeof price.currency).toBe("string");
  expect(price.currency).toMatch(/^[A-Z]{3}$/); // Enforces uppercase ISO 4217
  expect(typeof price.active).toBe("boolean");

  expect(
    VALID_PRICE_TYPES.has(price.type),
    `type "${price.type}" is not a valid PricingType`,
  ).toBe(true);

  if (price.type === "recurring") {
    expect(
      price.interval,
      "Recurring price must have a defined interval",
    ).toBeDefined();
  }

  expect(
    VALID_BILLING_SCHEMES.has(price.billingScheme),
    `billingScheme "${(price as any).billingScheme}" is not a valid PriceBillingScheme`,
  ).toBe(true);

  // 2. Assert Discriminated Union Properties (Polymorphic check)
  switch (price.billingScheme) {
    case "flat":
    case "per_unit":
      expect(
        typeof price.unitAmount,
        "Flat/PerUnit prices must have a unitAmount",
      ).toBe("number");
      expect(price.unitAmount).toBeGreaterThanOrEqual(0);
      break;

    case "metered":
      expect(
        typeof price.unitAmount,
        "Metered prices must have a unitAmount",
      ).toBe("number");
      expect(price.unitAmount).toBeGreaterThanOrEqual(0);
      break;

    case "tiered_volume":
    case "tiered_graduated":
      expect(
        Array.isArray(price.tiers),
        "Tiered prices must have a tiers array",
      ).toBe(true);
      expect(
        price.tiers.length,
        "Tiered prices must have at least one tier",
      ).toBeGreaterThan(0);

      price.tiers.forEach((tier, index) => {
        expect(typeof tier.minUnits).toBe("number");
        expect(typeof tier.unitAmount).toBe("number");
        if (tier.maxUnits !== null && tier.maxUnits !== undefined) {
          expect(typeof tier.maxUnits).toBe("number");
          expect(tier.maxUnits).toBeGreaterThan(tier.minUnits);
        }
      });
      break;

    case "custom":
      if (price.minimumAmount !== undefined) {
        expect(typeof price.minimumAmount).toBe("number");
        expect(price.minimumAmount).toBeGreaterThanOrEqual(0);
      }
      break;

    case "free":
      // Free prices don't enforce monetary fields.
      break;
  }

  // ─── DDD Temporal Contract ─────────────────────────────────────────────────
  expect(price.createdAt, "createdAt must be a native Date").toBeInstanceOf(
    Date,
  );
  expect(isNaN(price.createdAt.getTime()), "createdAt must be valid").toBe(
    false,
  );
}
