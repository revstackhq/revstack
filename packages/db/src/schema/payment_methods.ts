import { paymentMethodStatusEnum } from "@/schema/enums";
import { environments } from "@/schema/core";
import { customers } from "@/schema/customers";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import {
  integer,
  boolean,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";

export const paymentMethods = revstack.table("payment_methods", {
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
  brand: text("brand"), // 'visa', 'mastercard'
  last4: varchar("last4", { length: 4 }),
  expMonth: integer("exp_month"),
  expYear: integer("exp_year"),
  isDefault: boolean("is_default").default(false).notNull(),
  status: paymentMethodStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
