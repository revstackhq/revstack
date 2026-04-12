import { environments } from "@/schema/core";
import { customers } from "@/schema/customers";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { relations } from "drizzle-orm";
import {
  integer,
  boolean,
  timestamp,
  varchar,
  text,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const paymentMethodStatusEnum = revstack.enum("payment_method_status", [
  "active",
  "expired",
  "failed",
]);

export const paymentMethods = revstack.table(
  "payment_methods",
  {
    id: text("id")
      .$defaultFn(() => generateId("pm"))
      .primaryKey(),
    environmentId: text("environment_id")
      .references(() => environments.id)
      .notNull(),
    customerId: text("customer_id")
      .references(() => customers.id)
      .notNull(),
    providerPaymentMethodId: text("provider_payment_method_id").notNull(), // pm_123...
    type: text("type").notNull(), // 'card', 'sepa', 'us_bank_account'
    isDefault: boolean("is_default").default(false).notNull(),
    status: paymentMethodStatusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("pm_customer_idx").on(t.customerId),
    index("pm_env_idx").on(t.environmentId),
  ],
);

export const paymentMethodCards = revstack.table(
  "payment_method_cards",
  {
    id: text("id")
      .$defaultFn(() => generateId("pmc"))
      .primaryKey(),
    paymentMethodId: text("payment_method_id")
      .references(() => paymentMethods.id, { onDelete: "cascade" })
      .notNull(),
    brand: text("brand"), // 'visa', 'mastercard'
    last4: varchar("last4", { length: 4 }),
    expMonth: integer("exp_month"),
    expYear: integer("exp_year"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("pmc_payment_method_idx").on(t.paymentMethodId),
    index("pmc_brand_idx").on(t.brand),
  ],
);

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  environment: one(environments, {
    fields: [paymentMethods.environmentId],
    references: [environments.id],
  }),
  customer: one(customers, {
    fields: [paymentMethods.customerId],
    references: [customers.id],
  }),
  card: one(paymentMethodCards, {
    fields: [paymentMethods.id],
    references: [paymentMethodCards.paymentMethodId],
  }),
}));

export const paymentMethodCardsRelations = relations(
  paymentMethodCards,
  ({ one }) => ({
    paymentMethod: one(paymentMethods, {
      fields: [paymentMethodCards.paymentMethodId],
      references: [paymentMethods.id],
    }),
  }),
);
