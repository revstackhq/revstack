import { text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@/utils/id";
import { environments } from "@/schema/core";
import { users } from "@/schema/users";
import { customers } from "@/schema/customers";
import { processingStatusEnum, subscriptionStatusEnum } from "@/schema/enums";
import { plans } from "@/schema/plans";
import { prices } from "@/schema/prices";
import { addons } from "@/schema/addons";
import { coupons } from "@/schema/coupons";
import { invoices } from "@/schema/invoices";

/**
 * An active, past due, or canceled billing lifecycle for a user tied to a plan.
 */
export const subscriptions = revstack.table("subscriptions", {
  id: text("id")
    .$defaultFn(() => generateId("sub"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  customerId: text("customer_id").references(() => customers.id),
  planId: text("plan_id")
    .references(() => plans.id)
    .notNull(),
  priceId: text("price_id").references(() => prices.id), // Nullable for free tiers

  status: subscriptionStatusEnum("status").notNull(),

  currentPeriodStart: timestamp("current_period_start", {
    withTimezone: true,
  }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", {
    withTimezone: true,
  }).notNull(),

  // Advanced Lifecycle Tracking
  billingCycleAnchor: timestamp("billing_cycle_anchor", { withTimezone: true }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  canceledAt: timestamp("canceled_at", { withTimezone: true }),
  trialStart: timestamp("trial_start", { withTimezone: true }),
  trialEnd: timestamp("trial_end", { withTimezone: true }),

  externalSubscriptionId: text("external_subscription_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  nextBillingJobId: text("next_billing_job_id"),
  processingStatus: processingStatusEnum("processing_status")
    .default("idle")
    .notNull(),
});

/**
 * Links purchased Add-ons to a specific Subscription.
 */
export const subscriptionAddons = revstack.table("subscription_addons", {
  id: text("id")
    .$defaultFn(() => generateId("sadd"))
    .primaryKey(),
  subscriptionId: text("subscription_id")
    .references(() => subscriptions.id, { onDelete: "cascade" })
    .notNull(),
  addonId: text("addon_id")
    .references(() => addons.id, { onDelete: "restrict" })
    .notNull(),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Links coupons to specific subscriptions representing applied discounts.
 */
export const subscriptionCoupons = revstack.table("subscription_coupons", {
  /** Unique identifier for the subscription coupon. */
  id: text("id")
    .$defaultFn(() => generateId("scoup"))
    .primaryKey(),

  /** Foreign key referencing the subscription to which the coupon is applied. */
  subscriptionId: text("subscription_id")
    .notNull()
    .references(() => subscriptions.id, { onDelete: "cascade" }),

  /** Foreign key referencing the applied coupon. */
  couponId: text("coupon_id")
    .notNull()
    .references(() => coupons.id, { onDelete: "cascade" }),

  /** Timestamp when the coupon was applied to the subscription. */
  appliedAt: timestamp("applied_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  /** Optional timestamp when the coupon's application to the subscription expires. */
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

export const subscriptionsRelations = relations(
  subscriptions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [subscriptions.userId],
      references: [users.id],
    }),
    customer: one(customers, {
      fields: [subscriptions.customerId],
      references: [customers.id],
    }),
    plan: one(plans, {
      fields: [subscriptions.planId],
      references: [plans.id],
    }),
    price: one(prices, {
      fields: [subscriptions.priceId],
      references: [prices.id],
    }),
    addons: many(subscriptionAddons),
    invoices: many(invoices),
    subscriptionCoupons: many(subscriptionCoupons),
  }),
);

export const subscriptionAddonsRelations = relations(
  subscriptionAddons,
  ({ one }) => ({
    subscription: one(subscriptions, {
      fields: [subscriptionAddons.subscriptionId],
      references: [subscriptions.id],
    }),
    addon: one(addons, {
      fields: [subscriptionAddons.addonId],
      references: [addons.id],
    }),
  }),
);

export const subscriptionCouponsRelations = relations(
  subscriptionCoupons,
  ({ one }) => ({
    subscription: one(subscriptions, {
      fields: [subscriptionCoupons.subscriptionId],
      references: [subscriptions.id],
    }),
    coupon: one(coupons, {
      fields: [subscriptionCoupons.couponId],
      references: [coupons.id],
    }),
  }),
);
