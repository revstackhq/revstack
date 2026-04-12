import { text, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import { users } from "@/schema/users";
import { customers } from "@/schema/customers";
import { subscriptions } from "@/schema/subscriptions";
import { addons } from "@/schema/addons";
import { prices } from "@/schema/prices";
import { payments } from "@/schema/payments";
import { creditNotes } from "@/schema/credit_notes";

export const invoiceLineItemTypeEnum = revstack.enum("invoice_line_item_type", [
  "subscription",
  "one_time_charge",
  "overage",
  "addon",
  "setup_fee",
  "proration",
]);

export const invoiceStatusEnum = revstack.enum("invoice_status", [
  "draft",
  "open",
  "paid",
  "uncollectible",
  "void",
]);

export const invoices = revstack.table(
  "invoices",
  {
    id: text("id")
      .$defaultFn(() => generateId("inv"))
      .primaryKey(),
    environmentId: text("environment_id")
      .references(() => environments.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    customerId: text("customer_id")
      .references(() => customers.id, { onDelete: "cascade" })
      .notNull(),
    subscriptionId: text("subscription_id").references(() => subscriptions.id),
    amount: integer("amount").notNull(),
    subtotal: integer("subtotal").notNull().default(0),
    discount: integer("discount").notNull().default(0),
    tax: integer("tax").notNull().default(0),
    amountDue: integer("amount_due").notNull().default(0),
    amountPaid: integer("amount_paid").notNull().default(0),
    amountRemaining: integer("amount_remaining").notNull().default(0),
    amountRefunded: integer("amount_refunded").default(0).notNull(),
    currency: text("currency").notNull().default("USD"),
    status: invoiceStatusEnum("status").notNull(),
    billingReason: text("billing_reason"),
    idempotencyKey: text("idempotency_key").unique(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    nextRetryAt: timestamp("next_retry_at", { withTimezone: true }),
    dunningStep: integer("dunning_step").default(0).notNull(),
  },
  (t) => [
    index("inv_env_status_idx").on(t.environmentId, t.status),
    index("inv_customer_idx").on(t.customerId),
    index("inv_subscription_idx").on(t.subscriptionId),
  ],
);

export const invoiceLineItems = revstack.table(
  "invoice_line_items",
  {
    id: text("id")
      .$defaultFn(() => generateId("ili"))
      .primaryKey(),
    invoiceId: text("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    priceId: text("price_id").references(() => prices.id, {
      onDelete: "set null",
    }),
    addonId: text("addon_id").references(() => addons.id, {
      onDelete: "set null",
    }),

    name: text("name").notNull(),
    description: text("description"),
    quantity: integer("quantity").notNull().default(1),
    unitAmount: integer("unit_amount").notNull(),
    amount: integer("amount").notNull(),
    type: invoiceLineItemTypeEnum("type").notNull(),

    periodStart: timestamp("period_start", { withTimezone: true }),
    periodEnd: timestamp("period_end", { withTimezone: true }),
    metadata: jsonb("metadata").default({}),
  },
  (t) => [index("ili_invoice_idx").on(t.invoiceId)],
);

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  user: one(users, { fields: [invoices.userId], references: [users.id] }),
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  subscription: one(subscriptions, {
    fields: [invoices.subscriptionId],
    references: [subscriptions.id],
  }),
  environment: one(environments, {
    fields: [invoices.environmentId],
    references: [environments.id],
  }),
  payments: many(payments),
  creditNotes: many(creditNotes),
  invoiceLineItems: many(invoiceLineItems),
}));

export const invoiceLineItemsRelations = relations(
  invoiceLineItems,
  ({ one }) => ({
    invoice: one(invoices, {
      fields: [invoiceLineItems.invoiceId],
      references: [invoices.id],
    }),
    price: one(prices, {
      fields: [invoiceLineItems.priceId],
      references: [prices.id],
    }),
    addon: one(addons, {
      fields: [invoiceLineItems.addonId],
      references: [addons.id],
    }),
  }),
);
