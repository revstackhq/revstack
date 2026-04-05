import { text, timestamp, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import { planTypeEnum, statusEnum, resetPeriodEnum } from "@/schema/enums";
import { entitlements } from "@/schema/entitlements";
import { prices } from "@/schema/prices";
import { subscriptions } from "@/schema/subscriptions";

/**
 * Represents a logical grouping of prices and entitlements that a customer can subscribe to.
 */
export const plans = revstack.table("plans", {
  id: text("id")
    .$defaultFn(() => generateId("plan"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: planTypeEnum("type").notNull().default("paid"),
  status: statusEnum("status").notNull().default("active"),
  isDefault: boolean("is_default").default(false).notNull(), // Ideal for "Guest" or fallback plans
  isPublic: boolean("is_public").default(true).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Association table that links specific Entitlements to Plans.
 * Defines the concrete limits granted by a plan for an entitlement.
 */
export const planEntitlements = revstack.table("plan_entitlements", {
  id: text("id")
    .$defaultFn(() => generateId("pent"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  planId: text("plan_id")
    .references(() => plans.id, { onDelete: "cascade" })
    .notNull(),
  entitlementId: text("entitlement_id")
    .references(() => entitlements.id, { onDelete: "cascade" })
    .notNull(),

  /** External ID used to sync metered usage with Stripe V2 Metering or Polar. */
  meterId: text("meter_id"),

  // Specific values based on the entitlement type
  valueLimit: integer("value_limit"),
  valueBool: boolean("value_bool"),
  valueText: text("value_text"),
  valueJson: jsonb("value_json"), // For complex configs or UI layouts

  /** If true, the system strictly enforces the limit without overages. */
  isHardLimit: boolean("is_hard_limit").default(true).notNull(),

  /** Defines how often a metered entitlement resets its usage counter. */
  resetPeriod: resetPeriodEnum("reset_period"),
});

export const plansRelations = relations(plans, ({ one, many }) => ({
  environment: one(environments, {
    fields: [plans.environmentId],
    references: [environments.id],
  }),
  entitlements: many(planEntitlements),
  prices: many(prices),
  subscriptions: many(subscriptions),
}));

export const planEntitlementsRelations = relations(
  planEntitlements,
  ({ one }) => ({
    plan: one(plans, {
      fields: [planEntitlements.planId],
      references: [plans.id],
    }),
    entitlement: one(entitlements, {
      fields: [planEntitlements.entitlementId],
      references: [entitlements.id],
    }),
  }),
);
