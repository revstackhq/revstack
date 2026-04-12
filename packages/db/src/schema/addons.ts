import {
  text,
  timestamp,
  integer,
  jsonb,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { environments } from "@/schema/core";
import { entitlements } from "@/schema/entitlements";
import { subscriptionAddons } from "@/schema/subscriptions";
import {
  ADDON_ENTITLEMENT_TYPES,
  PRICING_TYPES,
  STATUSES,
  generateId,
} from "@revstackhq/core";
import { billingIntervalEnum } from "./enums";

export const addonTypeEnum = revstack.enum("addon_type", PRICING_TYPES);

export const addonStatusEnum = revstack.enum("addon_status", STATUSES);

export const addonEntitlementTypeEnum = revstack.enum(
  "addon_entitlement_type",
  ADDON_ENTITLEMENT_TYPES,
);

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
    status: addonStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    unique("unq_addon_slug_env_idx").on(t.environmentId, t.slug),
    index("addon_env_status_idx").on(t.environmentId, t.status),
  ],
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
