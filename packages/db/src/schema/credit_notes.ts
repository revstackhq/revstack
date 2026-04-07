import { text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import { invoices } from "@/schema/invoices";
import { refunds } from "@/schema/refunds";
import { creditNoteReasonEnum, creditNoteStatusEnum } from "@/schema/enums";

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
  reasonCode: creditNoteReasonEnum("reason_code").default("other"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: creditNoteStatusEnum("status").notNull().default("issued"),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

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
