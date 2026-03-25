import { PostgresEntitlementRepo } from "@/modules/entitlements/infrastructure/adapters/PostgresEntitlementRepo";
import { CreateEntitlementHandler } from "@/modules/entitlements/application/commands/CreateEntitlementHandler";
import { DeleteEntitlementHandler } from "@/modules/entitlements/application/commands/DeleteEntitlementHandler";
import { ListEntitlementsHandler } from "@/modules/entitlements/application/queries/ListEntitlementsHandler";

import { PostgresPlanRepo } from "@/modules/plans/infrastructure/adapters/PostgresPlanRepo";
import { CreatePlanHandler } from "@/modules/plans/application/commands/CreatePlanHandler";
import { ListPlansHandler } from "@/modules/plans/application/queries/ListPlansHandler";
import { ArchivePlanHandler } from "@/modules/plans/application/commands/ArchivePlanHandler";
import { HidePlanHandler } from "@/modules/plans/application/commands/HidePlanHandler";

import { CreatePlanEntitlementHandler } from "@/modules/plan_entitlements/application/commands/CreatePlanEntitlementHandler";
import { UpdatePlanEntitlementLimitsHandler } from "@/modules/plan_entitlements/application/commands/UpdatePlanEntitlementLimitsHandler";
import { DeletePlanEntitlementHandler } from "@/modules/plan_entitlements/application/commands/DeletePlanEntitlementHandler";
import { ListPlanEntitlementsHandler } from "@/modules/plan_entitlements/application/queries/ListPlanEntitlementsHandler";
import { GetPlanEntitlementHandler } from "@/modules/plan_entitlements/application/queries/GetPlanEntitlementHandler";

import { CreatePriceHandler } from "@/modules/prices/application/commands/CreatePriceHandler";
import { UpdatePriceHandler } from "@/modules/prices/application/commands/UpdatePriceHandler";
import { VersionPriceHandler } from "@/modules/prices/application/commands/VersionPriceHandler";
import { ListPricesHandler } from "@/modules/prices/application/queries/ListPricesHandler";
import { GetPriceHandler } from "@/modules/prices/application/queries/GetPriceHandler";

import { CreateAddonHandler } from "@/modules/addons/application/commands/CreateAddonHandler";
import { CreateManyAddonsHandler } from "@/modules/addons/application/commands/CreateManyAddonsHandler";
import { ArchiveAddonHandler } from "@/modules/addons/application/commands/ArchiveAddonHandler";
import { ListAddonsHandler } from "@/modules/addons/application/queries/ListAddonsHandler";
import { GetAddonHandler } from "@/modules/addons/application/queries/GetAddonHandler";

import { CreateCouponHandler } from "@/modules/coupons/application/commands/CreateCouponHandler";
import { UpdateCouponHandler } from "@/modules/coupons/application/commands/UpdateCouponHandler";
import { ArchiveCouponHandler } from "@/modules/coupons/application/commands/ArchiveCouponHandler";
import { DeleteCouponHandler } from "@/modules/coupons/application/commands/DeleteCouponHandler";
import { ListCouponsHandler } from "@/modules/coupons/application/queries/ListCouponsHandler";
import { GetCouponHandler } from "@/modules/coupons/application/queries/GetCouponHandler";

import { CreateAddonEntitlementHandler } from "@/modules/addon_entitlements/application/commands/CreateAddonEntitlementHandler";
import { DeleteAddonEntitlementHandler } from "@/modules/addon_entitlements/application/commands/DeleteAddonEntitlementHandler";
import { ListAddonEntitlementsHandler } from "@/modules/addon_entitlements/application/queries/ListAddonEntitlementsHandler";
import { GetAddonEntitlementHandler } from "@/modules/addon_entitlements/application/queries/GetAddonEntitlementHandler";

import { PostgresCustomerRepository } from "@/modules/customers/infrastructure/adapters/PostgresCustomerRepository";
import { CreateCustomerHandler } from "@/modules/customers/application/commands/CreateCustomerHandler";
import { ListCustomersHandler } from "@/modules/customers/application/queries/ListCustomersHandler";
import { CreateManyCustomersHandler } from "@/modules/customers/application/commands/CreateManyCustomersHandler";
import { DeleteCustomerHandler } from "@/modules/customers/application/commands/DeleteCustomerHandler";

import { PostgresSubscriptionRepo } from "@/modules/subscriptions/infrastructure/adapters/PostgresSubscriptionRepo";
import { CreateSubscriptionHandler } from "@/modules/subscriptions/application/commands/CreateSubscriptionHandler";
import { CancelSubscriptionHandler } from "@/modules/subscriptions/application/commands/CancelSubscriptionHandler";
import { UpdateSubscriptionHandler } from "@/modules/subscriptions/application/commands/UpdateSubscriptionHandler";
import { ListCustomerSubscriptionsHandler } from "@/modules/subscriptions/application/queries/ListCustomerSubscriptionsHandler";
import { ListSubscriptionsHandler } from "@/modules/subscriptions/application/queries/ListSubscriptionsHandler";
import { GetSubscriptionHandler } from "@/modules/subscriptions/application/queries/GetSubscriptionHandler";

import { PostgresUsageRepo } from "@/modules/usage/infrastructure/adapters/PostgresUsageRepo";
import { RecordUsageHandler } from "@/modules/usage/application/commands/RecordUsageHandler";
import { CreateUsageMeterHandler } from "@/modules/usage/application/commands/CreateUsageMeterHandler";
import { UpdateUsageMeterHandler } from "@/modules/usage/application/commands/UpdateUsageMeterHandler";
import { ListUsagesHandler } from "@/modules/usage/application/queries/ListUsagesHandler";
import { GetUsageMeterHandler } from "@/modules/usage/application/queries/GetUsageMeterHandler";

import { PostgresWalletRepo } from "@/modules/wallets/infrastructure/adapters/PostgresWalletRepo";
import { CreditWalletHandler } from "@/modules/wallets/application/commands/CreditWalletHandler";
import { DebitWalletHandler } from "@/modules/wallets/application/commands/DebitWalletHandler";
import { GetWalletBalanceHandler } from "@/modules/wallets/application/queries/GetWalletBalanceHandler";
import { ListWalletTransactionsHandler } from "@/modules/wallets/application/queries/ListWalletTransactionsHandler";

import { PostgresInvoiceRepo } from "@/modules/invoices/infrastructure/adapters/PostgresInvoiceRepo";
import { CreateDraftInvoiceHandler } from "@/modules/invoices/application/commands/CreateDraftInvoiceHandler";
import { UpdateInvoiceHandler } from "@/modules/invoices/application/commands/UpdateInvoiceHandler";
import { FinalizeInvoiceHandler } from "@/modules/invoices/application/commands/FinalizeInvoiceHandler";
import { VoidInvoiceHandler } from "@/modules/invoices/application/commands/VoidInvoiceHandler";
import { ListInvoicesHandler } from "@/modules/invoices/application/queries/ListInvoicesHandler";
import { GetInvoiceHandler } from "@/modules/invoices/application/queries/GetInvoiceHandler";
import { ProcessPaymentHandler } from "@/modules/payments/application/commands/ProcessPaymentHandler";
import { AddInvoiceLineItemHandler } from "@/modules/invoices/application/commands/AddInvoiceLineItemHandler";
import { UpdateInvoiceLineItemHandler } from "@/modules/invoices/application/commands/UpdateInvoiceLineItemHandler";
import { DeleteInvoiceLineItemHandler } from "@/modules/invoices/application/commands/DeleteInvoiceLineItemHandler";

import { PostgresPaymentRepo } from "@/modules/payments/infrastructure/adapters/PostgresPaymentRepo";
import { GetPaymentHandler } from "@/modules/payments/application/queries/GetPaymentHandler";
import { ListPaymentsHandler } from "@/modules/payments/application/queries/ListPaymentsHandler";

import { PostgresRefundRepo } from "@/modules/refunds/infrastructure/adapters/PostgresRefundRepo";
import { CreateRefundHandler } from "@/modules/refunds/application/commands/CreateRefundHandler";
import { UpdateRefundHandler } from "@/modules/refunds/application/commands/UpdateRefundHandler";
import { ListRefundsHandler } from "@/modules/refunds/application/queries/ListRefundsHandler";
import { GetRefundHandler } from "@/modules/refunds/application/queries/GetRefundHandler";

import { PostgresCreditNoteRepo } from "@/modules/credit_notes/infrastructure/adapters/PostgresCreditNoteRepo";
import { CreateCreditNoteHandler } from "@/modules/credit_notes/application/commands/CreateCreditNoteHandler";
import { ListCreditNotesHandler } from "@/modules/credit_notes/application/queries/ListCreditNotesHandler";
import { GetCreditNoteHandler } from "@/modules/credit_notes/application/queries/GetCreditNoteHandler";

import { PostgresWebhookEndpointRepo } from "@/modules/webhooks/infrastructure/adapters/PostgresWebhookEndpointRepo";
import { CreateWebhookEndpointHandler } from "@/modules/webhooks/application/commands/CreateWebhookEndpointHandler";
import { ListWebhookEndpointsHandler } from "@/modules/webhooks/application/queries/ListWebhookEndpointsHandler";
import { DeactivateWebhookEndpointHandler } from "@/modules/webhooks/application/commands/DeactivateWebhookEndpointHandler";
import { RotateWebhookSecretHandler } from "@/modules/webhooks/application/commands/RotateWebhookSecretHandler";
import { ListWebhookDeliveriesHandler } from "@/modules/webhooks/application/queries/ListWebhookDeliveriesHandler";

import { PostgresApiKeyRepo } from "@/modules/system/infrastructure/adapters/PostgresApiKeyRepo";
import { CreateApiKeyHandler } from "@/modules/system/application/commands/CreateApiKeyHandler";
import { VerifyApiKeyHandler } from "@/modules/system/application/queries/VerifyApiKeyHandler";
import { ListApiKeysHandler } from "@/modules/system/application/queries/ListApiKeysHandler";
import { GetApiKeyHandler } from "@/modules/system/application/queries/GetApiKeyHandler";
import { UpdateApiKeyHandler } from "@/modules/system/application/commands/UpdateApiKeyHandler";
import { RotateApiKeyHandler } from "@/modules/system/application/commands/RotateApiKeyHandler";
import { DeleteApiKeyHandler } from "@/modules/system/application/commands/DeleteApiKeyHandler";

import { CreateEnvironmentHandler } from "@/modules/environments/application/commands/CreateEnvironmentHandler";
import { UpdateEnvironmentHandler } from "@/modules/environments/application/commands/UpdateEnvironmentHandler";
import { DeleteEnvironmentHandler } from "@/modules/environments/application/commands/DeleteEnvironmentHandler";
import { GetEnvironmentHandler } from "@/modules/environments/application/queries/GetEnvironmentHandler";
import { ListEnvironmentsHandler } from "@/modules/environments/application/queries/ListEnvironmentsHandler";

import { PutAuthConfigHandler } from "@/modules/auth/application/commands/PutAuthConfigHandler";
import { ListAuthConfigsHandler } from "@/modules/auth/application/queries/ListAuthConfigsHandler";
import { GetAuthConfigHandler } from "@/modules/auth/application/queries/GetAuthConfigHandler";

import { CreateStudioAdminHandler } from "@/modules/studio/application/commands/CreateStudioAdminHandler";
import { UpdateStudioAdminHandler } from "@/modules/studio/application/commands/UpdateStudioAdminHandler";
import { ListStudioAdminsHandler } from "@/modules/studio/application/queries/ListStudioAdminsHandler";
import { GetStudioAdminHandler } from "@/modules/studio/application/queries/GetStudioAdminHandler";

import { ListAuditLogsHandler } from "@/modules/audit/application/queries/ListAuditLogsHandler";
import { GetAuditLogHandler } from "@/modules/audit/application/queries/GetAuditLogHandler";

import { CreateUserHandler } from "@/modules/users/application/commands/CreateUserHandler";
import { UpdateUserHandler } from "@/modules/users/application/commands/UpdateUserHandler";
import { ListUsersHandler } from "@/modules/users/application/queries/ListUsersHandler";
import { GetUserHandler } from "@/modules/users/application/queries/GetUserHandler";

import { PostgresIntegrationRepo } from "@/modules/integrations/infrastructure/adapters/PostgresIntegrationRepo";
import { DummyProviderAdapter } from "@/modules/integrations/infrastructure/adapters/DummyProviderAdapter";
import { InstallIntegrationHandler } from "@/modules/integrations/application/commands/InstallIntegrationHandler";
import { UpdateIntegrationConfigHandler } from "@/modules/integrations/application/commands/UpdateIntegrationConfigHandler";
import { ListIntegrationsHandler } from "@/modules/integrations/application/queries/ListIntegrationsHandler";
import { GetIntegrationHandler } from "@/modules/integrations/application/queries/GetIntegrationHandler";

import { PostgresProviderEventRepo } from "@/modules/provider_events/infrastructure/adapters/PostgresProviderEventRepo";
import { CreateProviderEventHandler } from "@/modules/provider_events/application/commands/CreateProviderEventHandler";
import { ListProviderEventsHandler } from "@/modules/provider_events/application/queries/ListProviderEventsHandler";
import { GetProviderEventHandler } from "@/modules/provider_events/application/queries/GetProviderEventHandler";

import { db as PgDatabase } from "@revstackhq/db";

export type AppEnv = { Variables: ReturnType<typeof buildContainer> };

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

  const repos = {
    entitlements: new PostgresEntitlementRepo(db),
    plans: new PostgresPlanRepo(db),
    customers: new PostgresCustomerRepository(db),
    subscriptions: new PostgresSubscriptionRepo(db),
    usage: new PostgresUsageRepo(db),
    wallets: new PostgresWalletRepo(db),
    invoices: new PostgresInvoiceRepo(db),
    payments: new PostgresPaymentRepo(db),
    refunds: new PostgresRefundRepo(db),
    creditNotes: new PostgresCreditNoteRepo(db),
    webhooks: new PostgresWebhookEndpointRepo(db),
    apiKeys: new PostgresApiKeyRepo(db),
    integrations: new PostgresIntegrationRepo(db),
    providerEvents: new PostgresProviderEventRepo(db),
  };

  return {
    entitlements: {
      get create() { return new CreateEntitlementHandler(repos.entitlements, eventBus, cache); },
      get delete() { return new DeleteEntitlementHandler(repos.entitlements, eventBus); },
      get list() { return new ListEntitlementsHandler(repos.entitlements, cache); },
    },
    plans: {
      get create() { return new CreatePlanHandler(repos.plans, eventBus, cache); },
      get list() { return new ListPlansHandler(repos.plans, cache); },
      get archive() { return new ArchivePlanHandler(repos.plans); },
      get hide() { return new HidePlanHandler(repos.plans); },
    },
    planEntitlements: {
      get create() { return new CreatePlanEntitlementHandler({} as any, eventBus); },
      get updateLimits() { return new UpdatePlanEntitlementLimitsHandler({} as any, eventBus); },
      get delete() { return new DeletePlanEntitlementHandler({} as any, eventBus); },
      get list() { return new ListPlanEntitlementsHandler({} as any); },
      get get() { return new GetPlanEntitlementHandler({} as any); },
    },
    prices: {
      get create() { return new CreatePriceHandler({} as any, eventBus); },
      get update() { return new UpdatePriceHandler({} as any, eventBus); },
      get version() { return new VersionPriceHandler({} as any, eventBus); },
      get list() { return new ListPricesHandler({} as any); },
      get get() { return new GetPriceHandler({} as any); },
    },
    addons: {
      get create() { return new CreateAddonHandler({} as any, eventBus); },
      get createMany() { return new CreateManyAddonsHandler({} as any, eventBus); },
      get archive() { return new ArchiveAddonHandler({} as any, eventBus); },
      get list() { return new ListAddonsHandler({} as any); },
      get get() { return new GetAddonHandler({} as any); },
    },
    addonEntitlements: {
      get create() { return new CreateAddonEntitlementHandler({} as any, eventBus); },
      get delete() { return new DeleteAddonEntitlementHandler({} as any, eventBus); },
      get list() { return new ListAddonEntitlementsHandler({} as any); },
      get get() { return new GetAddonEntitlementHandler({} as any); },
    },
    coupons: {
      get create() { return new CreateCouponHandler({} as any, eventBus); },
      get update() { return new UpdateCouponHandler({} as any, eventBus); },
      get archive() { return new ArchiveCouponHandler({} as any, eventBus); },
      get delete() { return new DeleteCouponHandler({} as any, eventBus); },
      get list() { return new ListCouponsHandler({} as any); },
      get get() { return new GetCouponHandler({} as any); },
    },
    customers: {
      get create() { return new CreateCustomerHandler(repos.customers, eventBus, cache); },
      get list() { return new ListCustomersHandler(repos.customers, cache); },
      get createMany() { return new CreateManyCustomersHandler(repos.customers, eventBus); },
      get delete() { return new DeleteCustomerHandler(repos.customers, eventBus); },
    },
    subscriptions: {
      get create() { return new CreateSubscriptionHandler(repos.subscriptions, eventBus, cache); },
      get cancel() { return new CancelSubscriptionHandler(repos.subscriptions, eventBus); },
      get update() { return new UpdateSubscriptionHandler(repos.subscriptions, eventBus); },
      get listCustomerSubscriptions() { return new ListCustomerSubscriptionsHandler(repos.subscriptions, cache); },
      get list() { return new ListSubscriptionsHandler(repos.subscriptions); },
      get get() { return new GetSubscriptionHandler(repos.subscriptions); },
    },
    usage: {
      get record() { return new RecordUsageHandler(repos.usage, eventBus); },
      get createMeter() { return new CreateUsageMeterHandler(repos.usage, eventBus); },
      get updateMeter() { return new UpdateUsageMeterHandler(repos.usage, eventBus); },
      get list() { return new ListUsagesHandler(repos.usage); },
      get getMeter() { return new GetUsageMeterHandler(repos.usage, cache); },
    },
    wallets: {
      get credit() { return new CreditWalletHandler(repos.wallets, eventBus); },
      get debit() { return new DebitWalletHandler(repos.wallets, eventBus); },
      get getBalance() { return new GetWalletBalanceHandler(repos.wallets, cache); },
      get listTransactions() { return new ListWalletTransactionsHandler(repos.wallets); },
    },
    invoices: {
      get createDraft() { return new CreateDraftInvoiceHandler(repos.invoices, eventBus, cache); },
      get update() { return new UpdateInvoiceHandler(repos.invoices, eventBus); },
      get finalize() { return new FinalizeInvoiceHandler(repos.invoices, eventBus); },
      get void() { return new VoidInvoiceHandler(repos.invoices, eventBus); },
      get list() { return new ListInvoicesHandler(repos.invoices, cache); },
      get get() { return new GetInvoiceHandler(repos.invoices); },
      get addLineItem() { return new AddInvoiceLineItemHandler(repos.invoices, eventBus); },
      get updateLineItem() { return new UpdateInvoiceLineItemHandler(repos.invoices, eventBus); },
      get deleteLineItem() { return new DeleteInvoiceLineItemHandler(repos.invoices, eventBus); },
    },
    payments: {
      get process() { return new ProcessPaymentHandler(repos.payments, repos.invoices, eventBus); },
      get list() { return new ListPaymentsHandler(repos.payments); },
      get get() { return new GetPaymentHandler(repos.payments); },
    },
    refunds: {
      get create() { return new CreateRefundHandler(repos.refunds, eventBus); },
      get update() { return new UpdateRefundHandler(repos.refunds, eventBus); },
      get list() { return new ListRefundsHandler(repos.refunds); },
      get get() { return new GetRefundHandler(repos.refunds); },
    },
    creditNotes: {
      get create() { return new CreateCreditNoteHandler(repos.creditNotes, eventBus); },
      get list() { return new ListCreditNotesHandler(repos.creditNotes); },
      get get() { return new GetCreditNoteHandler(repos.creditNotes); },
    },
    webhooks: {
      get createEndpoint() { return new CreateWebhookEndpointHandler(repos.webhooks, eventBus); },
      get listEndpoints() { return new ListWebhookEndpointsHandler(repos.webhooks, cache); },
      get deactivateEndpoint() { return new DeactivateWebhookEndpointHandler(repos.webhooks, eventBus); },
      get rotateSecret() { return new RotateWebhookSecretHandler(repos.webhooks, eventBus); },
      get listDeliveries() { return new ListWebhookDeliveriesHandler(repos.webhooks); },
    },
    system: {
      get createApiKey() { return new CreateApiKeyHandler(repos.apiKeys, eventBus); },
      get verifyApiKey() { return new VerifyApiKeyHandler(repos.apiKeys, cache); },
      get listApiKeys() { return new ListApiKeysHandler(repos.apiKeys); },
      get getApiKey() { return new GetApiKeyHandler(repos.apiKeys); },
      get updateApiKey() { return new UpdateApiKeyHandler(repos.apiKeys, eventBus); },
      get rotateApiKey() { return new RotateApiKeyHandler(repos.apiKeys, eventBus); },
      get deleteApiKey() { return new DeleteApiKeyHandler(repos.apiKeys, eventBus); },
    },
    environments: {
      get create() { return new CreateEnvironmentHandler({} as any, eventBus); },
      get update() { return new UpdateEnvironmentHandler({} as any); },
      get delete() { return new DeleteEnvironmentHandler({} as any, eventBus); },
      get get() { return new GetEnvironmentHandler({} as any); },
      get list() { return new ListEnvironmentsHandler({} as any); },
    },
    auth: {
      get putConfig() { return new PutAuthConfigHandler({} as any, eventBus); },
      get listConfigs() { return new ListAuthConfigsHandler({} as any); },
      get getConfig() { return new GetAuthConfigHandler({} as any); },
    },
    studio: {
      get createAdmin() { return new CreateStudioAdminHandler({} as any, eventBus); },
      get updateAdmin() { return new UpdateStudioAdminHandler({} as any); },
      get listAdmins() { return new ListStudioAdminsHandler({} as any); },
      get getAdmin() { return new GetStudioAdminHandler({} as any); },
    },
    audit: {
      get listLogs() { return new ListAuditLogsHandler({} as any); },
      get getLog() { return new GetAuditLogHandler({} as any); },
    },
    users: {
      get create() { return new CreateUserHandler({} as any, eventBus); },
      get update() { return new UpdateUserHandler({} as any, eventBus); },
      get list() { return new ListUsersHandler({} as any); },
      get get() { return new GetUserHandler({} as any); },
    },
    integrations: {
      get install() { 
        const adapter = new DummyProviderAdapter();
        return new InstallIntegrationHandler(repos.integrations, adapter, eventBus); 
      },
      get updateConfig() { 
        const adapter = new DummyProviderAdapter();
        return new UpdateIntegrationConfigHandler(repos.integrations, adapter, eventBus); 
      },
      get list() { return new ListIntegrationsHandler(repos.integrations); },
      get get() { return new GetIntegrationHandler(repos.integrations); },
    },
    providerEvents: {
      get create() { return new CreateProviderEventHandler(repos.providerEvents, eventBus); },
      get list() { return new ListProviderEventsHandler(repos.providerEvents); },
      get get() { return new GetProviderEventHandler(repos.providerEvents); },
    },
  };
}
