import { text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { revstack } from "@/schema/namespace";
import { generateId } from "@/utils/id";
import { environments } from "@/schema/core";

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

/**
 * Customers mapping for external gateways (e.g., Stripe, Polar).
 * Allows a single Revstack user to have multiple external customer records.
 */
export const customers = revstack.table("customers", {
  id: text("id")
    .$defaultFn(() => generateId("cus"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  providerId: text("provider_id").notNull(),
  externalId: text("external_id").notNull(),
  email: text("email").notNull(),
  name: text("name"),
  phone: text("phone"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
