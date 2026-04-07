import { text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import {
  CustomerBillingAddress,
  CustomerStatus,
  generateId,
} from "@revstackhq/core";
import { environments } from "@/schema/core";
import { users } from "@/schema/users";
import { subscriptions } from "@/schema/subscriptions";
import { invoices } from "@/schema/invoices";

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
  name: text("name").notNull(),
  phone: text("phone"),
  metadata: jsonb("metadata")
    .$type<Record<string, unknown>>()
    .$defaultFn(() => ({})),
  currency: text("currency").default("USD").notNull(),
  status: text("status").$type<CustomerStatus>().default("active").notNull(),
  billingAddress: jsonb("billing_address").$type<CustomerBillingAddress>(),
  taxIds: jsonb("tax_ids")
    .$type<
      Array<{
        type: string; // 'eu_vat', 'cl_rut', 'us_ein', etc.
        value: string;
      }>
    >()
    .default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
  environment: one(environments, {
    fields: [customers.environmentId],
    references: [environments.id],
  }),
  subscriptions: many(subscriptions),
  invoices: many(invoices),
}));
