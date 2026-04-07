import { text, timestamp, integer, jsonb, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { environments } from "@/schema/core";
import {
  addonTypeEnum,
  billingIntervalEnum,
  addonEntitlementTypeEnum,
  statusEnum,
} from "@/schema/enums";
import { entitlements } from "@/schema/entitlements";
import { subscriptionAddons } from "@/schema/subscriptions";
import { generateId } from "@revstackhq/core";

/**
 * Represents additional features or limits a user can purchase on top of their plan.
 */
export const addons = revstack.table(
  "addons",
  {
    id: text("id")
      .$defaultFn(() => generateId("add"))
      .primaryKey(),
    environmentId: text("environment_id")
      .references(() => environments.id, { onDelete: "cascade" })
      .notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    type: addonTypeEnum("type").notNull(),
    billingInterval: billingIntervalEnum("billing_interval"),
    billingIntervalCount: integer("billing_interval_count"),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("USD"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .$defaultFn(() => ({})),
    status: statusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [unique("unq_addon_slug_env_idx").on(t.environmentId, t.slug)],
);

/**
 * Association table that links specific Entitlements to Add-ons.
 */
export const addonEntitlements = revstack.table(
  "addon_entitlements",
  {
    id: text("id")
      .$defaultFn(() => generateId("aent"))
      .primaryKey(),
    addonId: text("addon_id")
      .references(() => addons.id, { onDelete: "cascade" })
      .notNull(),
    entitlementId: text("entitlement_id")
      .references(() => entitlements.id, { onDelete: "cascade" })
      .notNull(),

    valueLimit: integer("value_limit"),
    type: addonEntitlementTypeEnum("type").notNull().default("increment"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [unique("unq_addon_entitlement_idx").on(t.addonId, t.entitlementId)],
);

export const addonsRelations = relations(addons, ({ many }) => ({
  entitlements: many(addonEntitlements),
  subscriptions: many(subscriptionAddons),
}));

export const addonEntitlementsRelations = relations(
  addonEntitlements,
  ({ one }) => ({
    addon: one(addons, {
      fields: [addonEntitlements.addonId],
      references: [addons.id],
    }),
    entitlement: one(entitlements, {
      fields: [addonEntitlements.entitlementId],
      references: [entitlements.id],
    }),
  }),
);
