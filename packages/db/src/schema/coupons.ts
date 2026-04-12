import {
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import { subscriptionCoupons } from "@/schema/subscriptions";

export const discountTypeEnum = revstack.enum("discount_type", [
  "percentage",
  "fixed_amount",
]);

export const discountDurationEnum = revstack.enum("discount_duration", [
  "once",
  "forever",
  "repeating",
]);

export const discountStatusEnum = revstack.enum("discount_status", [
  "active",
  "inactive",
  "archived",
]);

/**
 * Coupons and Discounts mapped directly from the configuration file.
 */
export const coupons = revstack.table(
  "coupons",
  {
    id: text("id")
      .$defaultFn(() => generateId("coup"))
      .primaryKey(),
    environmentId: text("environment_id")
      .references(() => environments.id, { onDelete: "cascade" })
      .notNull(),
    code: text("code").notNull(),
    name: text("name"),
    type: discountTypeEnum("type").notNull(),
    value: integer("value").notNull(),
    duration: discountDurationEnum("duration").notNull(),
    durationInMonths: integer("duration_in_months"),
    maxRedemptions: integer("max_redemptions"),
    currency: text("currency"),
    redemptionsCount: integer("redemptions_count").default(0).notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .$defaultFn(() => ({})),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    status: discountStatusEnum("status").notNull().default("active"),
    restrictedPlanIds: text("restricted_plan_ids")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    isFirstTimeOnly: boolean("is_first_time_only").notNull().default(false),
  },
  (t) => [
    uniqueIndex("coup_env_code_idx").on(t.environmentId, t.code),
    index("coup_env_status_idx").on(t.environmentId, t.status),
  ],
);

export const couponsRelations = relations(coupons, ({ many }) => ({
  subscriptionCoupons: many(subscriptionCoupons),
}));
