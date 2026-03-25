import { text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@/utils/id";
import { environments } from "@/schema/core";
import { users } from "@/schema/users";
import { entitlements } from "@/schema/entitlements";
import { usageActionEnum } from "@/schema/enums";

/**
 * Immutable append-only log storing metric consumptions for metering.
 */
export const usages = revstack.table("usages", {
  id: text("id")
    .$defaultFn(() => generateId("evt"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  entitlementId: text("entitlement_id")
    .references(() => entitlements.id)
    .notNull(),
  amount: integer("amount").notNull().default(1),
  /** * Determines how the `amount` affects the usage_meters.
   * 'increment': Adds to the meter (e.g., +5 API calls).
   * 'decrement': Subtracts from the meter (e.g., Refunded 50 failed AI tokens).
   * 'set': Overrides the meter completely (e.g., Syncing exact active storage size to 500GB).
   */
  action: usageActionEnum("action").notNull().default("increment"),
  idempotencyKey: text("idempotency_key"),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .defaultNow()
    .notNull(),
  metadata: jsonb("metadata").default({}),
});

/**
 * Ultra-fast cache for plan quotas and post-paid metered usage.
 * Prevents the engine from doing expensive SUM() aggregations on the `usages` table.
 * The counter goes UP and resets based on the plan's `reset_period`.
 */
export const usageMeters = revstack.table("usage_meters", {
  id: text("id")
    .$defaultFn(() => generateId("meter"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  entitlementId: text("entitlement_id")
    .references(() => entitlements.id, { onDelete: "cascade" })
    .notNull(),

  currentUsage: integer("current_usage").notNull().default(0),
  lastEventAt: timestamp("last_event_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  resetAt: timestamp("reset_at", { withTimezone: true }),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const usagesRelations = relations(usages, ({ one }) => ({
  user: one(users, {
    fields: [usages.userId],
    references: [users.id],
  }),
  entitlement: one(entitlements, {
    fields: [usages.entitlementId],
    references: [entitlements.id],
  }),
  environment: one(environments, {
    fields: [usages.environmentId],
    references: [environments.id],
  }),
}));

export const usageMetersRelations = relations(usageMeters, ({ one }) => ({
  user: one(users, { fields: [usageMeters.userId], references: [users.id] }),
  entitlement: one(entitlements, {
    fields: [usageMeters.entitlementId],
    references: [entitlements.id],
  }),
  environment: one(environments, {
    fields: [usageMeters.environmentId],
    references: [environments.id],
  }),
}));
