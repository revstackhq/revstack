import { text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@/utils/id";
import { environments } from "@/schema/core";
import { customers } from "@/schema/customers";
import { invoices } from "@/schema/invoices";
import { paymentStatusEnum } from "@/schema/enums";

export const payments = revstack.table("payments", {
  id: text("id").$defaultFn(() => generateId("pay")).primaryKey(),
  environmentId: text("environment_id").references(() => environments.id, { onDelete: "cascade" }).notNull(),
  invoiceId: text("invoice_id").references(() => invoices.id),
  customerId: text("customer_id").references(() => customers.id),

  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: paymentStatusEnum("status").notNull(),
  providerId: text("provider_id").notNull(),
  externalId: text("external_id"),
  idempotencyKey: text("idempotency_key").unique(),
  errorMessage: text("error_message"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  environment: one(environments, { fields: [payments.environmentId], references: [environments.id] }),
  invoice: one(invoices, { fields: [payments.invoiceId], references: [invoices.id] }),
  customer: one(customers, { fields: [payments.customerId], references: [customers.id] }),
}));
