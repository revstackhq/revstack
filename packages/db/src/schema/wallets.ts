import {
  text,
  timestamp,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import { users } from "@/schema/users";
import { entitlements } from "@/schema/entitlements";

export const walletTxTypeEnum = revstack.enum("wallet_tx_type", [
  "credit",
  "debit",
]);

/**
 * Prepaid Balances / Credits for specific entitlements.
 * Allows users to prepay for 'metered' entitlements (e.g., AI Tokens).
 * The engine checks this balance BEFORE checking the plan's base limits.
 */
export const wallets = revstack.table(
  "wallets",
  {
    id: text("id")
      .$defaultFn(() => generateId("wal"))
      .primaryKey(),
    environmentId: text("environment_id")
      .references(() => environments.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    entitlementId: text("entitlement_id")
      .references(() => entitlements.id, { onDelete: "cascade" })
      .notNull(),

    /** The current cached balance for sub-millisecond Engine reads. */
    balance: integer("balance").notNull().default(0),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("wallet_env_user_entitlement_idx").on(
      t.environmentId,
      t.userId,
      t.entitlementId,
    ),
  ],
);

/**
 * The Immutable Ledger for Wallets.
 * Every time a wallet balance changes (credit or debit), a record MUST be inserted here.
 */
export const walletTransactions = revstack.table(
  "wallet_transactions",
  {
    id: text("id")
      .$defaultFn(() => generateId("wtx"))
      .primaryKey(),
    walletId: text("wallet_id")
      .references(() => wallets.id, { onDelete: "cascade" })
      .notNull(),
    amount: integer("amount").notNull(),
    type: walletTxTypeEnum("type").notNull(),

    /** Descriptive reason for the transaction (e.g., 'Topped up 10k tokens') */
    description: text("description").notNull(),

    /** Optional link to the usage_event or invoice that triggered this change */
    referenceId: text("reference_id"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("wallet_tx_wallet_idx").on(t.walletId)],
);

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
  entitlement: one(entitlements, {
    fields: [wallets.entitlementId],
    references: [entitlements.id],
  }),
  environment: one(environments, {
    fields: [wallets.environmentId],
    references: [environments.id],
  }),
  transactions: many(walletTransactions),
}));

export const walletTransactionsRelations = relations(
  walletTransactions,
  ({ one }) => ({
    wallet: one(wallets, {
      fields: [walletTransactions.walletId],
      references: [wallets.id],
    }),
  }),
);
