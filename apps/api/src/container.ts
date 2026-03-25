import { PostgresEntitlementRepo } from "@/modules/entitlements/infrastructure/adapters/PostgresEntitlementRepo";
import { CreateEntitlementHandler } from "@/modules/entitlements/application/commands/CreateEntitlementHandler";
import { ListEntitlementsHandler } from "@/modules/entitlements/application/queries/ListEntitlementsHandler";

import { PostgresPlanRepo } from "@/modules/plans/infrastructure/adapters/PostgresPlanRepo";
import { CreatePlanHandler } from "@/modules/plans/application/commands/CreatePlanHandler";
import { ListPlansHandler } from "@/modules/plans/application/queries/ListPlansHandler";

import { PostgresCustomerRepository } from "@/modules/customers/infrastructure/adapters/PostgresCustomerRepository";
import { CreateCustomerHandler } from "@/modules/customers/application/commands/CreateCustomerHandler";
import { ListCustomersHandler } from "@/modules/customers/application/queries/ListCustomersHandler";

import { PostgresSubscriptionRepo } from "@/modules/subscriptions/infrastructure/adapters/PostgresSubscriptionRepo";
import { CreateSubscriptionHandler } from "@/modules/subscriptions/application/commands/CreateSubscriptionHandler";
import { ListCustomerSubscriptionsHandler } from "@/modules/subscriptions/application/queries/ListCustomerSubscriptionsHandler";

import { PostgresUsageRepo } from "@/modules/usage/infrastructure/adapters/PostgresUsageRepo";
import { RecordUsageHandler } from "@/modules/usage/application/commands/RecordUsageHandler";
import { GetUsageMeterHandler } from "@/modules/usage/application/queries/GetUsageMeterHandler";

import { PostgresWalletRepo } from "@/modules/wallets/infrastructure/adapters/PostgresWalletRepo";
import { CreditWalletHandler } from "@/modules/wallets/application/commands/CreditWalletHandler";
import { GetWalletBalanceHandler } from "@/modules/wallets/application/queries/GetWalletBalanceHandler";

import { PostgresInvoiceRepo } from "@/modules/invoices/infrastructure/adapters/PostgresInvoiceRepo";
import { CreateDraftInvoiceHandler } from "@/modules/invoices/application/commands/CreateDraftInvoiceHandler";
import { ListInvoicesHandler } from "@/modules/invoices/application/queries/ListInvoicesHandler";

import { PostgresPaymentRepo } from "@/modules/invoices/infrastructure/adapters/PostgresPaymentRepo";
import { ProcessPaymentHandler } from "@/modules/invoices/application/commands/ProcessPaymentHandler";

import { PostgresWebhookEndpointRepo } from "@/modules/webhooks/infrastructure/adapters/PostgresWebhookEndpointRepo";
import { CreateWebhookEndpointHandler } from "@/modules/webhooks/application/commands/CreateWebhookEndpointHandler";
import { ListWebhookEndpointsHandler } from "@/modules/webhooks/application/queries/ListWebhookEndpointsHandler";

import { PostgresApiKeyRepo } from "@/modules/system/infrastructure/adapters/PostgresApiKeyRepo";
import { CreateApiKeyHandler } from "@/modules/system/application/commands/CreateApiKeyHandler";
import { VerifyApiKeyHandler } from "@/modules/system/application/queries/VerifyApiKeyHandler";

import { db as PgDatabase } from "@revstackhq/db";

export type AppEnv = { Variables: ReturnType<typeof buildContainer> };

/**
 * Composition Root: Wires up Infrastructure Adapters into Application Query/Command Handlers lazily.
 */
export function buildContainer() {
  const db = PgDatabase;
  const cache = {
    get: async () => null,
    set: async () => {},
    invalidate: async () => {},
  };

  const useInngest = process.env.EVENT_PROVIDER === "inngest";
  const eventBus = useInngest
    ? { publish: async (e: any) => console.log("[Inngest] Published", e) }
    : { publish: async (e: any) => console.log("[Native] Published", e) };

  return {
    // --- ENTITLEMENTS ---
    get createEntitlementHandler() {
      const repo = new PostgresEntitlementRepo(db);
      return new CreateEntitlementHandler(repo, eventBus, cache);
    },
    get listEntitlementsHandler() {
      const repo = new PostgresEntitlementRepo(db);
      return new ListEntitlementsHandler(repo, cache);
    },

    // --- PLANS ---
    get createPlanHandler() {
      const repo = new PostgresPlanRepo(db);
      return new CreatePlanHandler(repo, eventBus, cache);
    },
    get listPlansHandler() {
      const repo = new PostgresPlanRepo(db);
      return new ListPlansHandler(repo, cache);
    },

    // --- CUSTOMERS ---
    get createCustomerHandler() {
      const repo = new PostgresCustomerRepository(db);
      return new CreateCustomerHandler(repo, eventBus, cache);
    },
    get listCustomersHandler() {
      const repo = new PostgresCustomerRepository(db);
      return new ListCustomersHandler(repo, cache);
    },

    // --- SUBSCRIPTIONS ---
    get createSubscriptionHandler() {
      const repo = new PostgresSubscriptionRepo(db);
      return new CreateSubscriptionHandler(repo, eventBus, cache);
    },
    get listCustomerSubscriptionsHandler() {
      const repo = new PostgresSubscriptionRepo(db);
      return new ListCustomerSubscriptionsHandler(repo, cache);
    },

    // --- USAGE ---
    get recordUsageHandler() {
      const repo = new PostgresUsageRepo(db);
      return new RecordUsageHandler(repo, eventBus);
    },
    get getUsageMeterHandler() {
      const repo = new PostgresUsageRepo(db);
      return new GetUsageMeterHandler(repo, cache);
    },

    // --- WALLETS ---
    get creditWalletHandler() {
      const repo = new PostgresWalletRepo(db);
      return new CreditWalletHandler(repo, eventBus);
    },
    get getWalletBalanceHandler() {
      const repo = new PostgresWalletRepo(db);
      return new GetWalletBalanceHandler(repo, cache);
    },

    // --- INVOICES ---
    get createDraftInvoiceHandler() {
      const repo = new PostgresInvoiceRepo(db);
      return new CreateDraftInvoiceHandler(repo, eventBus, cache);
    },
    get listInvoicesHandler() {
      const repo = new PostgresInvoiceRepo(db);
      return new ListInvoicesHandler(repo, cache);
    },

    // --- PAYMENTS ---
    get processPaymentHandler() {
      const paymentRepo = new PostgresPaymentRepo(db);
      const invoiceRepo = new PostgresInvoiceRepo(db);
      return new ProcessPaymentHandler(paymentRepo, invoiceRepo, eventBus);
    },

    // --- WEBHOOKS ---
    get createWebhookEndpointHandler() {
      const repo = new PostgresWebhookEndpointRepo(db);
      return new CreateWebhookEndpointHandler(repo, eventBus);
    },
    get listWebhookEndpointsHandler() {
      const repo = new PostgresWebhookEndpointRepo(db);
      return new ListWebhookEndpointsHandler(repo, cache);
    },

    // --- SYSTEM & AUTH ---
    get createApiKeyHandler() {
      const repo = new PostgresApiKeyRepo(db);
      return new CreateApiKeyHandler(repo, eventBus);
    },
    get verifyApiKeyHandler() {
      const repo = new PostgresApiKeyRepo(db);
      return new VerifyApiKeyHandler(repo, cache);
    },
  };
}
