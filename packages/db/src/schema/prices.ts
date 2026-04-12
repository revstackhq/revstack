import { text, timestamp, jsonb, integer, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import {
  BILLING_INTERVALS,
  PRICING_TYPES,
  STATUSES,
  generateId,
} from "@revstackhq/core";
import { environments } from "@/schema/core";
import { plans } from "@/schema/plans";
import { subscriptions } from "@/schema/subscriptions";
import { billingIntervalEnum } from "./enums";

export const pricingTypeEnum = revstack.enum("pricing_type", PRICING_TYPES);

export const billingSchemeEnum = revstack.enum("billing_scheme", [
  "flat",
  "per_unit",
  "tiered_volume",
  "tiered_graduated",
  "metered",
  "custom",
  "free",
]);

export const priceStatusEnum = revstack.enum("price_status", STATUSES);

/**
 * Defines the localized pricing, billing intervals, and structural costs for a specific Plan.
 */
export const prices = revstack.table(
  "prices",
  {
    id: text("id")
      .$defaultFn(() => generateId("price"))
      .primaryKey(),
    environmentId: text("environment_id")
      .references(() => environments.id, { onDelete: "cascade" })
      .notNull(),
    planId: text("plan_id")
      .references(() => plans.id, { onDelete: "cascade" })
      .notNull(),

    // Maps to BasePrice.type
    type: pricingTypeEnum("type").notNull().default("recurring"),

    // Maps to FlatPrice.unitAmount, PerUnitPrice.unitAmount, MeteredPrice.unitAmount, etc.
    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("USD"),

    // Maps to BasePrice.interval
    billingInterval: billingIntervalEnum("billing_interval").notNull(),

    // ADDED: Maps to BasePrice.intervalCount (e.g., billing every *3* months)
    intervalCount: integer("interval_count").default(1).notNull(),

    trialPeriodDays: integer("trial_period_days").default(0).notNull(),

    // Maps to the discriminator union
    billingScheme: billingSchemeEnum("billing_scheme")
      .notNull()
      .default("flat"),

    // Maps to TieredPrice.tiers
    tiers: jsonb("tiers"),

    // ADDED: Maps to CustomPrice.minimumAmount (Used only when billingScheme is 'custom')
    minimumAmount: integer("minimum_amount"),

    // ADDED: Maps to BasePrice.unitLabel
    unitLabel: text("unit_label"),

    // ADDED: Maps to BasePrice.metadata
    metadata: jsonb("metadata").default({}),

    overageConfig: jsonb("overage_config"),
    status: priceStatusEnum("status").notNull().default("active"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("price_env_idx").on(t.environmentId),
    index("price_plan_idx").on(t.planId),
    index("price_env_status_idx").on(t.environmentId, t.status),
  ],
);

export const pricesRelations = relations(prices, ({ one, many }) => ({
  plan: one(plans, {
    fields: [prices.planId],
    references: [plans.id],
  }),
  subscriptions: many(subscriptions),
}));
