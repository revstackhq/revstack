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
 * Asserts that a Price entity conforms to the Revstack canonical catalog model.
 */
export function assertPriceShape(price: Price): void {
  expect(price, "Price must be defined").toBeDefined();
  expect(typeof price.id).toBe("string");
  expect(price.id.length).toBeGreaterThan(0);
  expect(typeof price.productId).toBe("string");
  expect(typeof price.unitAmount).toBe("number");
  expect(price.unitAmount).toBeGreaterThanOrEqual(0);
  expect(typeof price.currency).toBe("string");
  expect(price.currency).toMatch(/^[A-Z]{3}$/);

  expect(
    VALID_PRICE_TYPES.has(price.type),
    `type "${price.type}" is not a valid PricingType`,
  ).toBe(true);

  if (price.type === "recurring") {
    expect(
      price.interval,
      "Recurring price must have an interval",
    ).toBeDefined();
  }

  // ─── DDD Temporal Contract ─────────────────────────────────────────────────
  expect(price.createdAt, "createdAt must be a native Date").toBeInstanceOf(
    Date,
  );
  expect(isNaN(price.createdAt.getTime()), "createdAt must be valid").toBe(
    false,
  );
}
