import { text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { revstack } from "@/schema/namespace";
import { generateId } from "@/utils/id";
import { environments } from "@/schema/core";
import { users, customers } from "@/schema/users";
import { subscriptions } from "@/schema/subscriptions";
import {
  invoiceStatusEnum,
  paymentStatusEnum,
  refundStatusEnum,
  creditNoteStatusEnum,
  eventTypeEnum,
  invoiceLineItemTypeEnum,
} from "@/schema/enums";
import { addons } from "@/schema/addons";
import { prices } from "@/schema/prices";

/**
 * Historical transactional invoice tracking for accounting.
 */
export const invoices = revstack.table("invoices", {
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

  currency: text("currency").notNull().default("USD"),
  status: invoiceStatusEnum("status").notNull(), // 'draft', 'open', 'paid', 'void'

  billingReason: text("billing_reason"),

  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Represents an individual line item on an invoice.
 */
export const invoiceLineItems = revstack.table("invoice_line_items", {
  /** Unique identifier for the invoice line item. */
  id: text("id")
    .$defaultFn(() => generateId("ili"))
    .primaryKey(),

  /** Foreign key referencing the associated invoice. */
  invoiceId: text("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),

  /** Optional foreign key referencing the associated price. */
  priceId: text("price_id").references(() => prices.id, {
    onDelete: "set null",
  }),

  /** Optional foreign key referencing the associated addon. */
  addonId: text("addon_id").references(() => addons.id, {
    onDelete: "set null",
  }),

  /** Name of the line item (e.g., "Pro Plan - March"). */
  name: text("name").notNull(),

  /** Optional description providing more details about the line item. */
  description: text("description"),

  /** Quantity of the item or service billed. */
  quantity: integer("quantity").notNull().default(1),

  /** Unit amount strictly in integer (zero-decimal cents). */
  unitAmount: integer("unit_amount").notNull(),

  /** Total amount for this line item strictly in integer (zero-decimal cents). */
  amount: integer("amount").notNull(),

  /** The type of the line item. */
  type: invoiceLineItemTypeEnum("type").notNull(),

  /** Optional start timestamp for the billing period covered by this line item. */
  periodStart: timestamp("period_start", { withTimezone: true }),

  /** Optional end timestamp for the billing period covered by this line item. */
  periodEnd: timestamp("period_end", { withTimezone: true }),

  /** Additional metadata for the line item as a JSONB object. */
  metadata: jsonb("metadata").default({}),
});

/**
 * Ledger of all payment attempts capturing money from an external gateway.
 */
export const payments = revstack.table("payments", {
  id: text("id")
    .$defaultFn(() => generateId("pay"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  invoiceId: text("invoice_id").references(() => invoices.id),
  customerId: text("customer_id").references(() => customers.id),

  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: paymentStatusEnum("status").notNull(),
  providerId: text("provider_id").notNull(),
  externalId: text("external_id"), // e.g. pi_xxx
  errorMessage: text("error_message"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Immutable ledger of money refunded to a customer card via a payment gateway.
 */
export const refunds = revstack.table("refunds", {
  id: text("id")
    .$defaultFn(() => generateId("ref"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  paymentId: text("payment_id")
    .references(() => payments.id, { onDelete: "cascade" })
    .notNull(),

  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: refundStatusEnum("status").notNull(),
  reason: text("reason"),
  externalId: text("external_id"), // e.g. re_xxx

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Credit Notes documenting an invoice adjustment or refund (e.g., during proration).
 */
export const creditNotes = revstack.table("credit_notes", {
  id: text("id")
    .$defaultFn(() => generateId("cn"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  invoiceId: text("invoice_id")
    .references(() => invoices.id, { onDelete: "cascade" })
    .notNull(),
  refundId: text("refund_id").references(() => refunds.id),

  amount: integer("amount").notNull(), // Total credited amount
  currency: text("currency").notNull().default("USD"),
  status: creditNoteStatusEnum("status").notNull().default("issued"),
  reason: text("reason"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Immutable ledger of all incoming provider webhooks and standard domain events.
 */
export const providerEvents = revstack.table("provider_events", {
  id: text("id")
    .$defaultFn(() => generateId("pevt"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  providerId: text("provider_id").notNull(),
  providerEventId: text("provider_event_id").notNull(),
  type: eventTypeEnum("type").notNull(),
  resourceId: text("resource_id").notNull(),
  customerId: text("customer_id"),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
