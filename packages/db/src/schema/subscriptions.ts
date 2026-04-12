import {
  text,
  timestamp,
  boolean,
  integer,
  uniqueIndex,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import { users } from "@/schema/users";
import { customers } from "@/schema/customers";
import { plans } from "@/schema/plans";
import { prices } from "@/schema/prices";
import { addons } from "@/schema/addons";
import { coupons } from "@/schema/coupons";
import { invoices } from "@/schema/invoices";
import { SUBSCRIPTION_STATUSES } from "@revstackhq/core";

export const processingStatusEnum = revstack.enum("processing_status", [
  "idle",
  "processing",
  "failed",
]);

export const subscriptionStatusEnum = revstack.enum(
  "subscription_status",
  SUBSCRIPTION_STATUSES,
);

/**
 * An active, past due, or canceled billing lifecycle for a user tied to a plan.
 */
export const subscriptions = revstack.table(
  "subscriptions",
  {
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
    billingCycleAnchor: timestamp("billing_cycle_anchor", {
      withTimezone: true,
    }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    pausedAt: timestamp("paused_at", { withTimezone: true }),
    trialStart: timestamp("trial_start", { withTimezone: true }),
    trialEnd: timestamp("trial_end", { withTimezone: true }),
    externalSubscriptionId: text("external_subscription_id"),

    nextBillingJobId: text("next_billing_job_id"),
    processingStatus: processingStatusEnum("processing_status")
      .default("idle")
      .notNull(),
    pendingPlanId: text("pending_plan_id").references(() => plans.id),
    pendingPriceId: text("pending_price_id").references(() => prices.id),
    scheduleChangeAt: timestamp("schedule_change_at", { withTimezone: true }),
    currency: text("currency").default("usd").notNull(),
    providerMetadata: jsonb("provider_metadata")
      .$type<Record<string, unknown>>()
      .default({}),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
    version: integer("version").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("sub_external_idx").on(
      t.externalSubscriptionId,
      t.environmentId,
    ),
    index("sub_schedule_idx").on(t.environmentId, t.scheduleChangeAt),
    index("sub_customer_status_idx").on(t.customerId, t.status),
    index("sub_user_env_status_idx").on(t.userId, t.environmentId, t.status),
    index("sub_env_status_period_idx").on(
      t.environmentId,
      t.status,
      t.currentPeriodEnd,
    ),
  ],
);

/**
 * Billing-facing metadata separated from the core subscription row.
 * (Kept additive to preserve backward compatibility while migrating.)
 */
export const subscriptionBilling = revstack.table(
  "subscription_billing",
  {
    subscriptionId: text("subscription_id")
      .references(() => subscriptions.id, { onDelete: "cascade" })
      .primaryKey(),
    currency: text("currency").notNull(),
    externalSubscriptionId: text("external_subscription_id"),
    providerMetadata: jsonb("provider_metadata")
      .$type<Record<string, unknown>>()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("sub_bill_external_idx").on(t.externalSubscriptionId)],
);

/**
 * Links purchased Add-ons to a specific Subscription.
 */
export const subscriptionAddons = revstack.table(
  "subscription_addons",
  {
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
    unitAmount: integer("unit_amount").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("sub_addon_subscription_idx").on(t.subscriptionId),
    index("sub_addon_addon_idx").on(t.addonId),
  ],
);

/**
 * Links coupons to specific subscriptions representing applied discounts.
 */
export const subscriptionCoupons = revstack.table(
  "subscription_coupons",
  {
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

    benefitEndsAt: timestamp("benefit_ends_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("sub_coupon_unique_idx").on(t.subscriptionId, t.couponId),
    index("sub_coupon_coupon_idx").on(t.couponId),
  ],
);

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
    pendingPlan: one(plans, {
      fields: [subscriptions.pendingPlanId],
      references: [plans.id],
    }),
    pendingPrice: one(prices, {
      fields: [subscriptions.pendingPriceId],
      references: [prices.id],
    }),
    addons: many(subscriptionAddons),
    invoices: many(invoices),
    subscriptionCoupons: many(subscriptionCoupons),
    billing: one(subscriptionBilling, {
      fields: [subscriptions.id],
      references: [subscriptionBilling.subscriptionId],
    }),
    environment: one(environments, {
      fields: [subscriptions.environmentId],
      references: [environments.id],
    }),
  }),
);

export const subscriptionBillingRelations = relations(
  subscriptionBilling,
  ({ one }) => ({
    subscription: one(subscriptions, {
      fields: [subscriptionBilling.subscriptionId],
      references: [subscriptions.id],
    }),
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
