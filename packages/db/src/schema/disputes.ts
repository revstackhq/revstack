import { environments } from "@/schema/core";
import { payments } from "@/schema/payments";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { relations } from "drizzle-orm";
import { integer, text, timestamp, index } from "drizzle-orm/pg-core";

export const disputeStatusEnum = revstack.enum("dispute_status", [
  "needs_response",
  "under_review",
  "won",
  "lost",
  "warning",
]);

export const disputes = revstack.table(
  "disputes",
  {
    id: text("id")
      .$defaultFn(() => generateId("dp"))
      .primaryKey(),
    environmentId: text("environment_id")
      .references(() => environments.id)
      .notNull(),
    paymentId: text("payment_id")
      .references(() => payments.id)
      .notNull(),
    amountDisputed: integer("amount_disputed").notNull(),
    feeAmount: integer("fee_amount").notNull(), // e.g: 1500 for $15.00
    currency: text("currency").default("USD").notNull(),
    status: disputeStatusEnum("status").default("needs_response").notNull(),
    reason: text("reason"), // e.g: "subscription_canceled", "product_not_received"
    evidenceDueBy: timestamp("evidence_due_by", { withTimezone: true }),
    externalId: text("external_id").unique(), // e.g Stripe (dp_...)
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("disp_env_status_idx").on(t.environmentId, t.status),
    index("disp_payment_idx").on(t.paymentId),
  ],
);

export const disputesRelations = relations(disputes, ({ one }) => ({
  payment: one(payments, {
    fields: [disputes.paymentId],
    references: [payments.id],
  }),
  environment: one(environments, {
    fields: [disputes.environmentId],
    references: [environments.id],
  }),
}));
