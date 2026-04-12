import { text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import { payments } from "@/schema/payments";
import { creditNotes } from "@/schema";

export const refundStatusEnum = revstack.enum("refund_status", [
  "pending",
  "succeeded",
  "failed",
  "canceled",
]);

export const refunds = revstack.table(
  "refunds",
  {
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
    externalId: text("external_id"),
    failureCode: text("failure_code"), // e.g: "expired_card", "insufficient_funds"
    failureMessage: text("failure_message"),
    idempotencyKey: text("idempotency_key").unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("ref_payment_idx").on(t.paymentId)],
);

export const refundsRelations = relations(refunds, ({ one }) => ({
  payment: one(payments, {
    fields: [refunds.paymentId],
    references: [payments.id],
  }),
  creditNote: one(creditNotes, {
    fields: [refunds.id],
    references: [creditNotes.refundId],
  }),
  environment: one(environments, {
    fields: [refunds.environmentId],
    references: [environments.id],
  }),
}));
