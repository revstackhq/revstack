import { expect } from "vitest";
import type { Subscription } from "@/types/subscriptions/model";
import { SubscriptionStatus } from "@/types/subscriptions/model";

const VALID_STATUSES = new Set(Object.values(SubscriptionStatus));

/**
 * Asserts that a Subscription entity conforms to the Revstack canonical model.
 * Validates the state machine status, multi-item structure, and temporal fields.
 */
export function assertSubscriptionShape(subscription: Subscription): void {
  expect(subscription, "Subscription must be defined").toBeDefined();
  expect(typeof subscription.id).toBe("string");
  expect(subscription.id.length).toBeGreaterThan(0);
  expect(typeof subscription.externalId).toBe("string");
  expect(typeof subscription.providerId).toBe("string");
  expect(typeof subscription.customerId).toBe("string");

  // ─── State Machine ─────────────────────────────────────────────────────────
  expect(
    VALID_STATUSES.has(subscription.status as SubscriptionStatus),
    `status "${subscription.status}" is not a valid SubscriptionStatus`,
  ).toBe(true);

  // ─── Financial Fields ──────────────────────────────────────────────────────
  expect(typeof subscription.amount).toBe("number");
  expect(subscription.amount).toBeGreaterThanOrEqual(0);
  expect(typeof subscription.currency).toBe("string");
  expect(subscription.currency).toMatch(/^[A-Z]{3}$/);

  // ─── Multi-Item Contract ───────────────────────────────────────────────────
  expect(Array.isArray(subscription.items)).toBe(true);
  for (const item of subscription.items) {
    expect(typeof item.externalId).toBe("string");
    expect(typeof item.priceId).toBe("string");
    expect(typeof item.productId).toBe("string");
    expect(typeof item.quantity).toBe("number");
    expect(item.quantity).toBeGreaterThan(0);
  }

  // ─── DDD Temporal Contract ─────────────────────────────────────────────────
  for (const field of [
    "currentPeriodStart",
    "currentPeriodEnd",
    "startedAt",
  ] as const) {
    expect(
      subscription[field],
      `${field} must be a native Date object`,
    ).toBeInstanceOf(Date);
    expect(
      isNaN(subscription[field].getTime()),
      `${field} must be a valid Date`,
    ).toBe(false);
  }

  // Optional dates
  for (const field of [
    "canceledAt",
    "endedAt",
    "trialStart",
    "trialEnd",
    "pauseResumesAt",
  ] as const) {
    if (subscription[field] !== undefined) {
      expect(
        subscription[field],
        `${field} must be a native Date`,
      ).toBeInstanceOf(Date);
    }
  }

  expect(typeof subscription.cancelAtPeriodEnd).toBe("boolean");
}
