import { buildAddonsModule } from "@/modules/addons/infrastructure/di/factory";
import { buildEntitlementsModule } from "@/modules/entitlements/infrastructure/di/factory";
import { PostgresPlanEntitlementRepository } from "@/modules/plans/infrastructure/adapters/PostgresPlanEntitlementRepository";
import { PostgresPriceRepository } from "@/modules/prices/infrastructure/adapters/PostgresPriceRepository";
import { PostgresEnvironmentRepository } from "@/modules/environments/infrastructure/adapters/PostgresEnvironmentRepository";
import { PostgresAuthConfigRepository } from "@/modules/identity_providers/infrastructure/adapters/PostgresAuthConfigRepository";
import { PostgresWorkspaceMemberRepository } from "@/modules/workspaces/infrastructure/adapters/PostgresWorkspaceMemberRepository";
import { PostgresAuditLogRepository } from "@/modules/audit/infrastructure/adapters/PostgresAuditLogRepository";
import { PostgresUserRepository } from "@/modules/users/infrastructure/adapters/PostgresUserRepository";

import { PostgresPlanRepository } from "@/modules/plans/infrastructure/adapters/PostgresPlanRepository";
import { CreatePlanHandler } from "@/modules/plans/application/use-cases/CreatePlan";
import { ListPlansHandler } from "@/modules/plans/application/use-cases/ListPlans";
import { ArchivePlanHandler } from "@/modules/plans/application/use-cases/ArchivePlan";
import { HidePlanHandler } from "@/modules/plans/application/use-cases/HidePlan";

import { CreatePriceHandler } from "@/modules/prices/application/use-cases/CreatePrice";
import { UpdatePriceHandler } from "@/modules/prices/application/use-cases/UpdatePrice";
import { VersionPriceHandler } from "@/modules/prices/application/use-cases/VersionPrice";
import { ListPricesHandler } from "@/modules/prices/application/use-cases/ListPrices";
import { GetPriceHandler } from "@/modules/prices/application/use-cases/GetPrice";

import { buildCouponsModule } from "@/modules/coupons/infrastructure/di/factory";
import { buildCustomersModule } from "@/modules/customers/infrastructure/di/factory";
import { PostgresSubscriptionRepository } from "@/modules/subscriptions/infrastructure/adapters/PostgresSubscriptionRepository";
import { CreateSubscriptionHandler } from "@/modules/subscriptions/application/use-cases/CreateSubscription";
import { CancelSubscriptionHandler } from "@/modules/subscriptions/application/use-cases/CancelSubscription";
import { UpdateSubscriptionHandler } from "@/modules/subscriptions/application/use-cases/UpdateSubscription";
import { ListCustomerSubscriptionsHandler } from "@/modules/subscriptions/application/use-cases/ListCustomerSubscriptions";
import { ListSubscriptionsHandler } from "@/modules/subscriptions/application/use-cases/ListSubscriptions";
import { GetSubscriptionHandler } from "@/modules/subscriptions/application/use-cases/GetSubscription";

import { PostgresUsageRepository } from "@/modules/usage/infrastructure/adapters/PostgresUsageRepository";
import { RecordUsageHandler } from "@/modules/usage/application/use-cases/RecordUsage";
import { CreateUsageMeterHandler } from "@/modules/usage/application/use-cases/CreateUsageMeter";
import { UpdateUsageMeterHandler } from "@/modules/usage/application/use-cases/UpdateUsageMeter";
import { ListUsagesHandler } from "@/modules/usage/application/use-cases/ListUsages";
import { GetUsageMeterHandler } from "@/modules/usage/application/use-cases/GetUsageMeter";

import { PostgresWalletRepository } from "@/modules/wallets/infrastructure/adapters/PostgresWalletRepository";
import { CreditWalletHandler } from "@/modules/wallets/application/use-cases/CreditWallet";
import { DebitWalletHandler } from "@/modules/wallets/application/use-cases/DebitWallet";
import { GetWalletBalanceHandler } from "@/modules/wallets/application/use-cases/GetWalletBalance";
import { ListWalletTransactionsHandler } from "@/modules/wallets/application/use-cases/ListWalletTransactions";

import { PostgresInvoiceRepository } from "@/modules/invoices/infrastructure/adapters/PostgresInvoiceRepository";
import { CreateDraftInvoiceHandler } from "@/modules/invoices/application/use-cases/CreateDraftInvoice";
import { UpdateInvoiceHandler } from "@/modules/invoices/application/use-cases/UpdateInvoice";
import { FinalizeInvoiceHandler } from "@/modules/invoices/application/use-cases/FinalizeInvoice";
import { VoidInvoiceHandler } from "@/modules/invoices/application/use-cases/VoidInvoice";
import { ListInvoicesHandler } from "@/modules/invoices/application/use-cases/ListInvoices";
import { GetInvoiceHandler } from "@/modules/invoices/application/use-cases/GetInvoice";
import { ProcessPaymentHandler } from "@/modules/payments/application/use-cases/ProcessPayment";
import { AddInvoiceLineItemHandler } from "@/modules/invoices/application/use-cases/AddInvoiceLineItem";
import { UpdateInvoiceLineItemHandler } from "@/modules/invoices/application/use-cases/UpdateInvoiceLineItem";
import { DeleteInvoiceLineItemHandler } from "@/modules/invoices/application/use-cases/DeleteInvoiceLineItem";

import { PostgresPaymentRepository } from "@/modules/payments/infrastructure/adapters/PostgresPaymentRepository";
import { GetPaymentHandler } from "@/modules/payments/application/use-cases/GetPayment";
import { ListPaymentsHandler } from "@/modules/payments/application/use-cases/ListPayments";

import { PostgresRefundRepository } from "@/modules/refunds/infrastructure/adapters/PostgresRefundRepository";
import { CreateRefundHandler } from "@/modules/refunds/application/use-cases/CreateRefund";
import { UpdateRefundHandler } from "@/modules/refunds/application/use-cases/UpdateRefund";
import { ListRefundsHandler } from "@/modules/refunds/application/use-cases/ListRefunds";
import { GetRefundHandler } from "@/modules/refunds/application/use-cases/GetRefund";

import { PostgresCreditNoteRepository } from "@/modules/invoices/infrastructure/adapters/PostgresCreditNoteRepository";
import { CreateCreditNoteHandler } from "@/modules/invoices/application/use-cases/CreateCreditNote";
import { ListCreditNotesHandler } from "@/modules/invoices/application/use-cases/ListCreditNotes";
import { GetCreditNoteHandler } from "@/modules/invoices/application/use-cases/GetCreditNote";

import { PostgresWebhookEndpointRepository } from "@/modules/webhooks/infrastructure/adapters/PostgresWebhookEndpointRepository";
import { CreateWebhookEndpointHandler } from "@/modules/webhooks/application/use-cases/CreateWebhookEndpoint";
import { ListWebhookEndpointsHandler } from "@/modules/webhooks/application/use-cases/ListWebhookEndpoints";
import { DeactivateWebhookEndpointHandler } from "@/modules/webhooks/application/use-cases/DeactivateWebhookEndpoint";
import { RotateWebhookSecretHandler } from "@/modules/webhooks/application/use-cases/RotateWebhookSecret";
import { ListWebhookDeliveriesHandler } from "@/modules/webhooks/application/use-cases/ListWebhookDeliveries";

import { CreateApiKeyHandler } from "@/modules/api_keys/application/use-cases/CreateApiKey";
import { VerifyApiKeyHandler } from "@/modules/api_keys/application/use-cases/VerifyApiKey";
import { ListApiKeysHandler } from "@/modules/api_keys/application/use-cases/ListApiKeys";
import { GetApiKeyHandler } from "@/modules/api_keys/application/use-cases/GetApiKey";
import { UpdateApiKeyHandler } from "@/modules/api_keys/application/use-cases/UpdateApiKey";
import { RotateApiKeyHandler } from "@/modules/api_keys/application/use-cases/RotateApiKey";
import { DeleteApiKeyHandler } from "@/modules/api_keys/application/use-cases/DeleteApiKey";

import { CreateEnvironmentHandler } from "@/modules/environments/application/use-cases/CreateEnvironment";
import { UpdateEnvironmentHandler } from "@/modules/environments/application/use-cases/UpdateEnvironment";
import { GetEnvironmentHandler } from "@/modules/environments/application/use-cases/GetEnvironment";
import { ListEnvironmentsHandler } from "@/modules/environments/application/use-cases/ListEnvironments";

import { PutAuthConfigHandler } from "@/modules/identity_providers/application/use-cases/PutAuthConfig";
import { ListAuthConfigsHandler } from "@/modules/identity_providers/application/use-cases/ListAuthConfigs";
import { GetAuthConfigHandler } from "@/modules/identity_providers/application/use-cases/GetAuthConfig";

import { CreateWorkspaceMemberHandler } from "@/modules/workspaces/application/use-cases/CreateWorkspaceMember";
import { UpdateWorkspaceMemberHandler } from "@/modules/workspaces/application/use-cases/UpdateWorkspaceMember";
import { ListWorkspaceMembersHandler } from "@/modules/workspaces/application/use-cases/ListWorkspaceMembers";
import { GetWorkspaceMemberHandler } from "@/modules/workspaces/application/use-cases/GetWorkspaceMember";

import { ListAuditLogsHandler } from "@/modules/audit/application/use-cases/ListAuditLogs";
import { GetAuditLogHandler } from "@/modules/audit/application/use-cases/GetAuditLog";

import { CreateUserHandler } from "@/modules/users/application/use-cases/CreateUser";
import { UpdateUserHandler } from "@/modules/users/application/use-cases/UpdateUser";
import { ListUsersHandler } from "@/modules/users/application/use-cases/ListUsers";
import { GetUserHandler } from "@/modules/users/application/use-cases/GetUser";

import { PostgresIntegrationRepository } from "@/modules/integrations/infrastructure/adapters/PostgresIntegrationRepository";
import { DummyProviderAdapter } from "@/modules/integrations/infrastructure/adapters/DummyProviderAdapter";
import { InstallIntegrationHandler } from "@/modules/integrations/application/use-cases/InstallIntegration";
import { UpdateIntegrationConfigHandler } from "@/modules/integrations/application/use-cases/UpdateIntegrationConfig";
import { ListIntegrationsHandler } from "@/modules/integrations/application/use-cases/ListIntegrations";
import { GetIntegrationHandler } from "@/modules/integrations/application/use-cases/GetIntegration";

import { PostgresProviderEventRepository } from "@/modules/provider_events/infrastructure/adapters/PostgresProviderEventRepository";
import { CreateProviderEventHandler } from "@/modules/provider_events/application/use-cases/CreateProviderEvent";
import { ListProviderEventsHandler } from "@/modules/provider_events/application/use-cases/ListProviderEvents";
import { GetProviderEventHandler } from "@/modules/provider_events/application/use-cases/GetProviderEvent";

import { db as PgDatabase } from "@revstackhq/db";
import { PostgresApiKeyRepository } from "@/modules/api_keys/infrastructure/adapters/PostgresApiKeyRepository";
import { AccessService } from "@/common/infrastructure/security/application/AccessService";
import { JwtService } from "@/common/infrastructure/security/JwtService";
import { DeleteEnvironmentHandler } from "@/modules/environments/application/use-cases/DeleteEnvironment";

export type AppEnv = {
  Variables: ReturnType<typeof buildContainer> & {
    environmentId: string;
    userId?: string;
    scopes: string[];
    authType: "api_key" | "jwt";
  };
};

export function buildContainer() {
  const db = PgDatabase;
  const cache = {
    get: async <T>(key: string): Promise<T | null> => {
      return null;
    },
    set: async (
      key: string,
      value: any,
      ttlSeconds?: number,
    ): Promise<void> => {
      return;
    },
    delete: async (key: string): Promise<void> => {
      return;
    },
    deletePrefix: async (prefix: string): Promise<void> => {
      return;
    },
  };

  const useInngest = process.env.EVENT_PROVIDER === "inngest";
  const eventBus = useInngest
    ? { publish: async (e: any) => console.log("[Inngest] Published", e) }
    : { publish: async (e: any) => console.log("[Native] Published", e) };

  const repos = {
    planEntitlements: new PostgresPlanEntitlementRepository(db),
    plans: new PostgresPlanRepository(db),
    prices: new PostgresPriceRepository(db),
    subscriptions: new PostgresSubscriptionRepository(db),
    usage: new PostgresUsageRepository(db),
    wallets: new PostgresWalletRepository(db),
    invoices: new PostgresInvoiceRepository(db),
    payments: new PostgresPaymentRepository(db),
    refunds: new PostgresRefundRepository(db),
    creditNotes: new PostgresCreditNoteRepository(db),
    webhooks: new PostgresWebhookEndpointRepository(db),
    apiKeys: new PostgresApiKeyRepository(db),
    environments: new PostgresEnvironmentRepository(db),
    authConfigs: new PostgresAuthConfigRepository(db),
    workspaceMembers: new PostgresWorkspaceMemberRepository(db),
    auditLogs: new PostgresAuditLogRepository(db),
    users: new PostgresUserRepository(db),
    integrations: new PostgresIntegrationRepository(db),
    providerEvents: new PostgresProviderEventRepository(db),
  };

  const jwtSecret = process.env.JWT_SECRET || "revstack-dev-secret";

  return {
    accessService: new AccessService(repos.apiKeys),
    jwtService: new JwtService(jwtSecret),
    entitlements: buildEntitlementsModule(db, eventBus, cache),
    plans: {
      get create() {
        return new CreatePlanHandler(repos.plans, eventBus, cache);
      },
      get list() {
        return new ListPlansHandler(repos.plans, cache);
      },
      get archive() {
        return new ArchivePlanHandler(repos.plans);
      },
      get hide() {
        return new HidePlanHandler(repos.plans);
      },
    },
    prices: {
      get create() {
        return new CreatePriceHandler(repos.prices, eventBus);
      },
      get update() {
        return new UpdatePriceHandler(repos.prices, eventBus);
      },
      get version() {
        return new VersionPriceHandler(repos.prices, eventBus);
      },
      get list() {
        return new ListPricesHandler(repos.prices);
      },
      get get() {
        return new GetPriceHandler(repos.prices);
      },
    },
    addons: buildAddonsModule(db, eventBus),
    coupons: buildCouponsModule(db, eventBus),
    customers: buildCustomersModule(db, eventBus),
    subscriptions: {
      get create() {
        return new CreateSubscriptionHandler(
          repos.subscriptions,
          eventBus,
          cache,
        );
      },
      get cancel() {
        return new CancelSubscriptionHandler(repos.subscriptions, eventBus);
      },
      get update() {
        return new UpdateSubscriptionHandler(repos.subscriptions, eventBus);
      },
      get listCustomerSubscriptions() {
        return new ListCustomerSubscriptionsHandler(repos.subscriptions, cache);
      },
      get list() {
        return new ListSubscriptionsHandler(repos.subscriptions);
      },
      get get() {
        return new GetSubscriptionHandler(repos.subscriptions);
      },
    },
    usage: {
      get record() {
        return new RecordUsageHandler(repos.usage, eventBus);
      },
      get createMeter() {
        return new CreateUsageMeterHandler(repos.usage, eventBus);
      },
      get updateMeter() {
        return new UpdateUsageMeterHandler(repos.usage, eventBus);
      },
      get list() {
        return new ListUsagesHandler(repos.usage);
      },
      get getMeter() {
        return new GetUsageMeterHandler(repos.usage, cache);
      },
    },
    wallets: {
      get credit() {
        return new CreditWalletHandler(repos.wallets, eventBus);
      },
      get debit() {
        return new DebitWalletHandler(repos.wallets, eventBus);
      },
      get getBalance() {
        return new GetWalletBalanceHandler(repos.wallets, cache);
      },
      get listTransactions() {
        return new ListWalletTransactionsHandler(repos.wallets);
      },
    },
    invoices: {
      get createDraft() {
        return new CreateDraftInvoiceHandler(repos.invoices, eventBus, cache);
      },
      get update() {
        return new UpdateInvoiceHandler(repos.invoices, eventBus);
      },
      get finalize() {
        return new FinalizeInvoiceHandler(repos.invoices, eventBus);
      },
      get void() {
        return new VoidInvoiceHandler(repos.invoices, eventBus);
      },
      get list() {
        return new ListInvoicesHandler(repos.invoices, cache);
      },
      get get() {
        return new GetInvoiceHandler(repos.invoices);
      },
      get addLineItem() {
        return new AddInvoiceLineItemHandler(repos.invoices, eventBus);
      },
      get updateLineItem() {
        return new UpdateInvoiceLineItemHandler(repos.invoices, eventBus);
      },
      get deleteLineItem() {
        return new DeleteInvoiceLineItemHandler(repos.invoices, eventBus);
      },
    },
    payments: {
      get process() {
        return new ProcessPaymentHandler(
          repos.payments,
          repos.invoices,
          eventBus,
        );
      },
      get list() {
        return new ListPaymentsHandler(repos.payments);
      },
      get get() {
        return new GetPaymentHandler(repos.payments);
      },
    },
    refunds: {
      get create() {
        return new CreateRefundHandler(repos.refunds, eventBus);
      },
      get update() {
        return new UpdateRefundHandler(repos.refunds, eventBus);
      },
      get list() {
        return new ListRefundsHandler(repos.refunds);
      },
      get get() {
        return new GetRefundHandler(repos.refunds);
      },
    },
    creditNotes: {
      get create() {
        return new CreateCreditNoteHandler(repos.creditNotes, eventBus);
      },
      get list() {
        return new ListCreditNotesHandler(repos.creditNotes);
      },
      get get() {
        return new GetCreditNoteHandler(repos.creditNotes);
      },
    },
    webhooks: {
      get createEndpoint() {
        return new CreateWebhookEndpointHandler(repos.webhooks, eventBus);
      },
      get listEndpoints() {
        return new ListWebhookEndpointsHandler(repos.webhooks, cache);
      },
      get deactivateEndpoint() {
        return new DeactivateWebhookEndpointHandler(repos.webhooks, eventBus);
      },
      get rotateSecret() {
        return new RotateWebhookSecretHandler(repos.webhooks, eventBus);
      },
      get listDeliveries() {
        return new ListWebhookDeliveriesHandler(repos.webhooks);
      },
    },
    system: {
      get createApiKey() {
        return new CreateApiKeyHandler(repos.apiKeys, eventBus);
      },
      get verifyApiKey() {
        return new VerifyApiKeyHandler(repos.apiKeys, cache);
      },
      get listApiKeys() {
        return new ListApiKeysHandler(repos.apiKeys);
      },
      get getApiKey() {
        return new GetApiKeyHandler(repos.apiKeys);
      },
      get updateApiKey() {
        return new UpdateApiKeyHandler(repos.apiKeys, eventBus);
      },
      get rotateApiKey() {
        return new RotateApiKeyHandler(repos.apiKeys, eventBus);
      },
      get deleteApiKey() {
        return new DeleteApiKeyHandler(repos.apiKeys, eventBus);
      },
    },
    environments: {
      get create() {
        return new CreateEnvironmentHandler(repos.environments, eventBus);
      },
      get update() {
        return new UpdateEnvironmentHandler(repos.environments, eventBus);
      },
      get delete() {
        return new DeleteEnvironmentHandler(repos.environments, eventBus);
      },
      get get() {
        return new GetEnvironmentHandler(repos.environments);
      },
      get list() {
        return new ListEnvironmentsHandler(repos.environments);
      },
    },
    auth: {
      get putConfig() {
        return new PutAuthConfigHandler(repos.authConfigs, eventBus);
      },
      get listConfigs() {
        return new ListAuthConfigsHandler(repos.authConfigs);
      },
      get getConfig() {
        return new GetAuthConfigHandler(repos.authConfigs);
      },
    },
    workspaces: {
      get create() {
        return new CreateWorkspaceMemberHandler(
          repos.workspaceMembers,
          eventBus,
        );
      },
      get update() {
        return new UpdateWorkspaceMemberHandler(repos.workspaceMembers);
      },
      get list() {
        return new ListWorkspaceMembersHandler(repos.workspaceMembers);
      },
      get get() {
        return new GetWorkspaceMemberHandler(repos.workspaceMembers);
      },
    },
    audit: {
      get listLogs() {
        return new ListAuditLogsHandler(repos.auditLogs);
      },
      get getLog() {
        return new GetAuditLogHandler(repos.auditLogs);
      },
    },
    users: {
      get create() {
        return new CreateUserHandler(repos.users, eventBus);
      },
      get update() {
        return new UpdateUserHandler(repos.users, eventBus);
      },
      get list() {
        return new ListUsersHandler(repos.users);
      },
      get get() {
        return new GetUserHandler(repos.users);
      },
    },
    integrations: {
      get install() {
        const adapter = new DummyProviderAdapter();
        return new InstallIntegrationHandler(
          repos.integrations,
          adapter,
          eventBus,
        );
      },
      get updateConfig() {
        const adapter = new DummyProviderAdapter();
        return new UpdateIntegrationConfigHandler(
          repos.integrations,
          adapter,
          eventBus,
        );
      },
      get list() {
        return new ListIntegrationsHandler(repos.integrations);
      },
      get get() {
        return new GetIntegrationHandler(repos.integrations);
      },
    },
    providerEvents: {
      get create() {
        return new CreateProviderEventHandler(repos.providerEvents, eventBus);
      },
      get list() {
        return new ListProviderEventsHandler(repos.providerEvents);
      },
      get get() {
        return new GetProviderEventHandler(repos.providerEvents);
      },
    },
  };
}
