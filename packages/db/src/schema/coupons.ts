import { text, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import {
  discountTypeEnum,
  discountDurationEnum,
  discountStatusEnum,
} from "@/schema/enums";
import { subscriptionCoupons } from "@/schema/subscriptions";

/**
 * Coupons and Discounts mapped directly from the configuration file.
 */
export const coupons = revstack.table("coupons", {
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
});

export const couponsRelations = relations(coupons, ({ many }) => ({
  subscriptionCoupons: many(subscriptionCoupons),
}));
