import { expect } from "vitest";
import type { Invoice } from "@/types/invoices/model";

const VALID_STATUSES = new Set([
  "draft",
  "open",
  "paid",
  "uncollectible",
  "void",
]);

/**
 * Asserts that an Invoice entity conforms to the Revstack canonical model.
 * Validates financial integrity, line items, and strict Date typing.
 */
export function assertInvoiceShape(invoice: Invoice): void {
  expect(invoice, "Invoice must be defined").toBeDefined();
  expect(typeof invoice.id).toBe("string");
  expect(typeof invoice.externalId).toBe("string");
  expect(typeof invoice.providerId).toBe("string");
  expect(typeof invoice.customerId).toBe("string");

  // ─── Status ────────────────────────────────────────────────────────────────
  expect(
    VALID_STATUSES.has(invoice.status),
    `status "${invoice.status}" is not a valid InvoiceStatus`,
  ).toBe(true);

  // ─── Financial Integrity ───────────────────────────────────────────────────
  expect(typeof invoice.subtotal).toBe("number");
  expect(typeof invoice.tax).toBe("number");
  expect(typeof invoice.discount).toBe("number");
  expect(typeof invoice.total).toBe("number");
  expect(typeof invoice.amountDue).toBe("number");
  expect(typeof invoice.amountPaid).toBe("number");
  expect(typeof invoice.currency).toBe("string");
  expect(invoice.currency).toMatch(/^[A-Z]{3}$/);

  // Financial correctness: total must equal subtotal - discount + tax (within rounding)
  const expectedTotal = invoice.subtotal - invoice.discount + invoice.tax;
  expect(
    Math.abs(invoice.total - expectedTotal),
    `total (${invoice.total}) does not equal subtotal - discount + tax (${expectedTotal})`,
  ).toBeLessThanOrEqual(1);

  // ─── Line Items ────────────────────────────────────────────────────────────
  expect(Array.isArray(invoice.lines)).toBe(true);
  for (const line of invoice.lines) {
    expect(typeof line.id).toBe("string");
    expect(typeof line.description).toBe("string");
    expect(typeof line.quantity).toBe("number");
    expect(typeof line.amountTotal).toBe("number");
  }

  // ─── DDD Temporal Contract ─────────────────────────────────────────────────
  expect(invoice.createdAt, "createdAt must be a native Date").toBeInstanceOf(
    Date,
  );
  expect(isNaN(invoice.createdAt.getTime()), "createdAt must be valid").toBe(
    false,
  );

  for (const field of ["dueDate", "finalizedAt", "paidAt"] as const) {
    if (invoice[field] !== undefined) {
      expect(invoice[field], `${field} must be a native Date`).toBeInstanceOf(
        Date,
      );
    }
  }
}
