import { text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import { customers } from "@/schema/customers";
import { invoices } from "@/schema/invoices";
import { refunds } from "@/schema";
import { disputes } from "@/schema/disputes";

export const paymentStatusEnum = revstack.enum("payment_status", [
  "pending",
  "requires_action",
  "processing",
  "authorized",
  "succeeded",
  "failed",
  "canceled",
  "refunded",
  "partially_refunded",
  "disputed",
]);

export const payments = revstack.table(
  "payments",
  {
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
    externalId: text("external_id"),
    idempotencyKey: text("idempotency_key").unique(),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("pay_env_status_idx").on(t.environmentId, t.status),
    index("pay_customer_idx").on(t.customerId),
    index("pay_invoice_idx").on(t.invoiceId),
    index("pay_external_idx").on(t.externalId),
  ],
);

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  environment: one(environments, {
    fields: [payments.environmentId],
    references: [environments.id],
  }),
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
  customer: one(customers, {
    fields: [payments.customerId],
    references: [customers.id],
  }),
  refunds: many(refunds),
  disputes: many(disputes),
}));
