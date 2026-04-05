import { text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import { subscriptions } from "@/schema/subscriptions";
import { usages, usageMeters } from "@/schema/usages";
import { invoices } from "@/schema/invoices";
import { wallets } from "@/schema/wallets";
import { customers } from "@/schema/customers";

/**
 * End-users and organizations utilizing the billed tenant.
 * Supports "Guests" (anonymous users) who can later be merged into authenticated users.
 */
export const users = revstack.table("users", {
  id: text("id")
    .$defaultFn(() => generateId("usr"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),

  /** * Origin application's unique ID for the customer (e.g., Supabase Auth UUID).
   * Nullable to allow Guest sessions to consume metered events before signing up.
   */
  externalId: text("external_id"),
  isGuest: boolean("is_guest").default(false).notNull(),

  email: text("email"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  customers: many(customers),
  subscriptions: many(subscriptions),
  usages: many(usages),
  usageMeters: many(usageMeters),
  invoices: many(invoices),
  wallets: many(wallets),
  environment: one(environments, {
    fields: [users.environmentId],
    references: [environments.id],
  }),
}));
