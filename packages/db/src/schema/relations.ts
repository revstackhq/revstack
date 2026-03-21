import { relations } from "drizzle-orm";
import {
  environments,
  apiKeys,
  integrations,
  authConfigs,
} from "@/schema/core";
import { users, customers } from "@/schema/users";
import {
  subscriptions,
  subscriptionAddons,
  subscriptionCoupons,
} from "@/schema/subscriptions";
import { wallets, walletTransactions } from "@/schema/wallets";
import { usages, usageMeters } from "@/schema/usages";
import {
  invoices,
  invoiceLineItems,
  payments,
  refunds,
  creditNotes,
  providerEvents,
} from "@/schema/ledger";
import { entitlements } from "@/schema/entitlements";
import { addons, addonEntitlements } from "@/schema/addons";
import { coupons } from "@/schema/coupons";
import { plans, planEntitlements } from "@/schema/plans";
import { prices } from "@/schema/prices";
import { studioAdmins, auditLogs } from "@/schema/studio";
import { webhookEndpoints, webhookDeliveries } from "@/schema/webhooks";

export const environmentsRelations = relations(environments, ({ many }) => ({
  apiKeys: many(apiKeys),
  integrations: many(integrations),
  authConfigs: many(authConfigs),
  users: many(users),
  customers: many(customers),
  plans: many(plans),
  entitlements: many(entitlements),
  providerEvents: many(providerEvents),
  payments: many(payments),
  refunds: many(refunds),
  creditNotes: many(creditNotes),
  usageMeters: many(usageMeters),
  auditLogs: many(auditLogs),
  webhookEndpoints: many(webhookEndpoints),
}));

export const usersRelations = relations(users, ({ many, one }) => ({
  customers: many(customers),
  subscriptions: many(subscriptions),
  usages: many(usages),
  usageMeters: many(usageMeters),
  invoices: many(invoices),
  wallets: many(wallets),
  environment: one(environments, {
    fields: [users.environmentId],
    references: [environments.id],
  }),
}));

export const authConfigsRelations = relations(authConfigs, ({ one }) => ({
  environment: one(environments, {
    fields: [authConfigs.environmentId],
    references: [environments.id],
  }),
}));

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

export const subscriptionsRelations = relations(
  subscriptions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [subscriptions.userId],
      references: [users.id],
    }),
    customer: one(customers, {
      fields: [subscriptions.customerId],
      references: [customers.id],
    }),
    plan: one(plans, {
      fields: [subscriptions.planId],
      references: [plans.id],
    }),
    price: one(prices, {
      fields: [subscriptions.priceId],
      references: [prices.id],
    }),
    addons: many(subscriptionAddons),
    invoices: many(invoices),
    subscriptionCoupons: many(subscriptionCoupons),
  }),
);

export const subscriptionAddonsRelations = relations(
  subscriptionAddons,
  ({ one }) => ({
    subscription: one(subscriptions, {
      fields: [subscriptionAddons.subscriptionId],
      references: [subscriptions.id],
    }),
    addon: one(addons, {
      fields: [subscriptionAddons.addonId],
      references: [addons.id],
    }),
  }),
);

export const plansRelations = relations(plans, ({ many }) => ({
  entitlements: many(planEntitlements),
  prices: many(prices),
  subscriptions: many(subscriptions),
}));

export const planEntitlementsRelations = relations(
  planEntitlements,
  ({ one }) => ({
    plan: one(plans, {
      fields: [planEntitlements.planId],
      references: [plans.id],
    }),
    entitlement: one(entitlements, {
      fields: [planEntitlements.entitlementId],
      references: [entitlements.id],
    }),
  }),
);

export const pricesRelations = relations(prices, ({ one, many }) => ({
  plan: one(plans, {
    fields: [prices.planId],
    references: [plans.id],
  }),
  subscriptions: many(subscriptions),
}));

export const addonsRelations = relations(addons, ({ many }) => ({
  entitlements: many(addonEntitlements),
  subscriptions: many(subscriptionAddons),
}));

export const addonEntitlementsRelations = relations(
  addonEntitlements,
  ({ one }) => ({
    addon: one(addons, {
      fields: [addonEntitlements.addonId],
      references: [addons.id],
    }),
    entitlement: one(entitlements, {
      fields: [addonEntitlements.entitlementId],
      references: [entitlements.id],
    }),
  }),
);

export const usagesRelations = relations(usages, ({ one }) => ({
  user: one(users, {
    fields: [usages.userId],
    references: [users.id],
  }),
  entitlement: one(entitlements, {
    fields: [usages.entitlementId],
    references: [entitlements.id],
  }),
  environment: one(environments, {
    fields: [usages.environmentId],
    references: [environments.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  subscription: one(subscriptions, {
    fields: [invoices.subscriptionId],
    references: [subscriptions.id],
  }),
  environment: one(environments, {
    fields: [invoices.environmentId],
    references: [environments.id],
  }),
  payments: many(payments),
  creditNotes: many(creditNotes),
  invoiceLineItems: many(invoiceLineItems),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
  environment: one(environments, {
    fields: [customers.environmentId],
    references: [environments.id],
  }),
  subscriptions: many(subscriptions),
  invoices: many(invoices),
}));

export const providerEventsRelations = relations(providerEvents, ({ one }) => ({
  environment: one(environments, {
    fields: [providerEvents.environmentId],
    references: [environments.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
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
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
  environment: one(environments, {
    fields: [refunds.environmentId],
    references: [environments.id],
  }),
  payment: one(payments, {
    fields: [refunds.paymentId],
    references: [payments.id],
  }),
}));

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

export const invoiceLineItemsRelations = relations(
  invoiceLineItems,
  ({ one }) => ({
    invoice: one(invoices, {
      fields: [invoiceLineItems.invoiceId],
      references: [invoices.id],
    }),
    price: one(prices, {
      fields: [invoiceLineItems.priceId],
      references: [prices.id],
    }),
    addon: one(addons, {
      fields: [invoiceLineItems.addonId],
      references: [addons.id],
    }),
  }),
);

export const subscriptionCouponsRelations = relations(
  subscriptionCoupons,
  ({ one }) => ({
    subscription: one(subscriptions, {
      fields: [subscriptionCoupons.subscriptionId],
      references: [subscriptions.id],
    }),
    coupon: one(coupons, {
      fields: [subscriptionCoupons.couponId],
      references: [coupons.id],
    }),
  }),
);

export const couponsRelations = relations(coupons, ({ many }) => ({
  subscriptionCoupons: many(subscriptionCoupons),
}));

export const usageMetersRelations = relations(usageMeters, ({ one }) => ({
  user: one(users, { fields: [usageMeters.userId], references: [users.id] }),
  entitlement: one(entitlements, {
    fields: [usageMeters.entitlementId],
    references: [entitlements.id],
  }),
  environment: one(environments, {
    fields: [usageMeters.environmentId],
    references: [environments.id],
  }),
}));

export const entitlementsRelations = relations(entitlements, ({ many }) => ({
  usageMeters: many(usageMeters),
}));

export const studioAdminsRelations = relations(studioAdmins, ({ many }) => ({
  auditLogs: many(auditLogs),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  environment: one(environments, { fields: [auditLogs.environmentId], references: [environments.id] }),
  studioAdmin: one(studioAdmins, { fields: [auditLogs.actorId], references: [studioAdmins.id] }),
}));

export const webhookEndpointsRelations = relations(webhookEndpoints, ({ one, many }) => ({
  environment: one(environments, { fields: [webhookEndpoints.environmentId], references: [environments.id] }),
  webhookDeliveries: many(webhookDeliveries),
}));

export const webhookDeliveriesRelations = relations(webhookDeliveries, ({ one }) => ({
  webhookEndpoint: one(webhookEndpoints, { fields: [webhookDeliveries.endpointId], references: [webhookEndpoints.id] }),
}));
