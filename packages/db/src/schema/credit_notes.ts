import { text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import { invoices } from "@/schema/invoices";
import { refunds } from "@/schema/refunds";

export const creditNoteReasonEnum = revstack.enum("credit_note_reason", [
  "duplicate",
  "fraudulent",
  "order_change",
  "product_unsatisfactory",
  "other",
]);

export const creditNoteStatusEnum = revstack.enum("credit_note_status", [
  "issued",
  "void",
]);

export const creditNotes = revstack.table(
  "credit_notes",
  {
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
    reasonCode: creditNoteReasonEnum("reason_code").default("other"),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("USD"),
    status: creditNoteStatusEnum("status").notNull().default("issued"),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("cn_env_idx").on(t.environmentId),
    index("cn_invoice_idx").on(t.invoiceId),
    index("cn_refund_idx").on(t.refundId),
  ],
);

export const creditNotesRelations = relations(creditNotes, ({ one }) => ({
  environment: one(environments, {
    fields: [creditNotes.environmentId],
    references: [environments.id],
  }),
  invoice: one(invoices, {
    fields: [creditNotes.invoiceId],
    references: [invoices.id],
  }),
}));
