import {
  boolean,
  integer,
  jsonb,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";

/**
 * Global billing/dunning policy per environment.
 * Keeps retry strategy and grace period configurable outside code.
 */
export const billingPolicies = revstack.table(
  "billing_policies",
  {
    id: text("id")
      .$defaultFn(() => generateId("bpol"))
      .primaryKey(),
    environmentId: text("environment_id")
      .references(() => environments.id, { onDelete: "cascade" })
      .notNull(),

    gracePeriodDays: integer("grace_period_days").notNull().default(0),
    maxAttempts: integer("max_attempts").notNull().default(0),

    /** Array of retry intervals in days (e.g., [1,3,5]) */
    retryIntervals: jsonb("retry_intervals")
      .$type<number[]>()
      .default([])
      .notNull(),

    /** Free-form strategy config for future expansion */
    dunningStrategy: jsonb("dunning_strategy")
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),

    cancelOnFailure: boolean("cancel_on_failure").notNull().default(false),
    pauseOnFailure: boolean("pause_on_failure").notNull().default(false),
    notifyOnFailure: boolean("notify_on_failure").notNull().default(true),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("billing_policy_env_idx").on(t.environmentId)],
);

export const billingPoliciesRelations = relations(
  billingPolicies,
  ({ one }) => ({
    environment: one(environments, {
      fields: [billingPolicies.environmentId],
      references: [environments.id],
    }),
  }),
);
