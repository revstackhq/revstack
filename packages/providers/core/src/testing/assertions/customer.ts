import { expect } from "vitest";
import type { Customer } from "@/types/customers/model";

/**
 * Asserts that a Customer entity strictly conforms to the Revstack canonical model.
 * Validates field presence, types, and DDD temporal rules (Dates, not strings).
 */
export function assertCustomerShape(customer: Customer): void {
  expect(customer, "Customer must be defined").toBeDefined();
  expect(typeof customer.id).toBe("string");
  expect(customer.id.length).toBeGreaterThan(0);
  expect(typeof customer.externalId).toBe("string");
  expect(customer.externalId.length).toBeGreaterThan(0);
  expect(typeof customer.providerId).toBe("string");
  expect(typeof customer.email).toBe("string");
  expect(customer.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  // ─── DDD Temporal Contract ─────────────────────────────────────────────────
  // createdAt MUST be a native Date, never a raw string or Unix number.
  expect(
    customer.createdAt,
    "createdAt must be a native Date object",
  ).toBeInstanceOf(Date);
  expect(
    isNaN(customer.createdAt.getTime()),
    "createdAt must be a valid Date",
  ).toBe(false);

  // Optional fields
  if (customer.name !== undefined) expect(typeof customer.name).toBe("string");
  if (customer.phone !== undefined)
    expect(typeof customer.phone).toBe("string");
  if (customer.metadata !== undefined)
    expect(typeof customer.metadata).toBe("object");
}
