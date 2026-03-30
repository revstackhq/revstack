import { PostgresEntitlementRepo } from "@/modules/entitlements/infrastructure/adapters/PostgresEntitlementRepo";
import { PostgresPlanEntitlementRepo } from "@/modules/plan_entitlements/infrastructure/adapters/PostgresPlanEntitlementRepo";
import { PostgresAddonEntitlementRepo } from "@/modules/addon_entitlements/infrastructure/adapters/PostgresAddonEntitlementRepo";
import { PostgresPriceRepo } from "@/modules/prices/infrastructure/adapters/PostgresPriceRepo";
import { PostgresAddonRepo } from "@/modules/addons/infrastructure/adapters/PostgresAddonRepo";
import { PostgresCouponRepo } from "@/modules/coupons/infrastructure/adapters/PostgresCouponRepo";
import { PostgresEnvironmentRepository } from "@/modules/environments/infrastructure/adapters/PostgresEnvironmentRepo";
import { PostgresAuthConfigRepo } from "@/modules/auth/infrastructure/adapters/PostgresAuthConfigRepo";
import { PostgresStudioAdminRepo } from "@/modules/studio/infrastructure/adapters/PostgresStudioAdminRepo";
import { PostgresAuditLogRepo } from "@/modules/audit/infrastructure/adapters/PostgresAuditLogRepo";
import { PostgresUserRepo } from "@/modules/users/infrastructure/adapters/PostgresUserRepo";
import { CreateEntitlementHandler } from "@/modules/entitlements/application/use-cases/CreateEntitlement/CreateEntitlement.handler";
import { DeleteEntitlementHandler } from "@/modules/entitlements/application/use-cases/DeleteEntitlement/DeleteEntitlement.handler";
import { ListEntitlementsHandler } from "@/modules/entitlements/application/use-cases/ListEntitlements/ListEntitlements.handler";

import { PostgresPlanRepo } from "@/modules/plans/infrastructure/adapters/PostgresPlanRepo";
import { CreatePlanHandler } from "@/modules/plans/application/use-cases/CreatePlan/CreatePlan.handler";
import { ListPlansHandler } from "@/modules/plans/application/use-cases/ListPlans/ListPlans.handler";
import { ArchivePlanHandler } from "@/modules/plans/application/use-cases/ArchivePlan/ArchivePlan.handler";
import { HidePlanHandler } from "@/modules/plans/application/use-cases/HidePlan/HidePlan.handler";

import { CreatePlanEntitlementHandler } from "@/modules/plan_entitlements/application/use-cases/CreatePlanEntitlement/CreatePlanEntitlement.handler";
import { UpdatePlanEntitlementLimitsHandler } from "@/modules/plan_entitlements/application/use-cases/UpdatePlanEntitlementLimits/UpdatePlanEntitlementLimits.handler";
import { DeletePlanEntitlementHandler } from "@/modules/plan_entitlements/application/use-cases/DeletePlanEntitlement/DeletePlanEntitlement.handler";
import { ListPlanEntitlementsHandler } from "@/modules/plan_entitlements/application/use-cases/ListPlanEntitlements/ListPlanEntitlements.handler";
import { GetPlanEntitlementHandler } from "@/modules/plan_entitlements/application/use-cases/GetPlanEntitlement/GetPlanEntitlement.handler";

import { CreatePriceHandler } from "@/modules/prices/application/use-cases/CreatePrice/CreatePrice.handler";
import { UpdatePriceHandler } from "@/modules/prices/application/use-cases/UpdatePrice/UpdatePrice.handler";
import { VersionPriceHandler } from "@/modules/prices/application/use-cases/VersionPrice/VersionPrice.handler";
import { ListPricesHandler } from "@/modules/prices/application/use-cases/ListPrices/ListPrices.handler";
import { GetPriceHandler } from "@/modules/prices/application/use-cases/GetPrice/GetPrice.handler";

import { CreateAddonHandler } from "@/modules/addons/application/use-cases/CreateAddon/CreateAddon.handler";
import { CreateManyAddonsHandler } from "@/modules/addons/application/use-cases/CreateManyAddons/CreateManyAddons.handler";
import { ArchiveAddonHandler } from "@/modules/addons/application/use-cases/ArchiveAddon/ArchiveAddon.handler";
import { ListAddonsHandler } from "@/modules/addons/application/use-cases/ListAddons/ListAddons.handler";
import { GetAddonHandler } from "@/modules/addons/application/use-cases/GetAddon/GetAddon.handler";

import { CreateCouponHandler } from "@/modules/coupons/application/use-cases/CreateCoupon/CreateCoupon.handler";
import { UpdateCouponHandler } from "@/modules/coupons/application/use-cases/UpdateCoupon/UpdateCoupon.handler";
import { ArchiveCouponHandler } from "@/modules/coupons/application/use-cases/ArchiveCoupon/ArchiveCoupon.handler";
import { DeleteCouponHandler } from "@/modules/coupons/application/use-cases/DeleteCoupon/DeleteCoupon.handler";
import { ListCouponsHandler } from "@/modules/coupons/application/use-cases/ListCoupons/ListCoupons.handler";
import { GetCouponHandler } from "@/modules/coupons/application/use-cases/GetCoupon/GetCoupon.handler";

import { CreateAddonEntitlementHandler } from "@/modules/addon_entitlements/application/use-cases/CreateAddonEntitlement/CreateAddonEntitlement.handler";
import { DeleteAddonEntitlementHandler } from "@/modules/addon_entitlements/application/use-cases/DeleteAddonEntitlement/DeleteAddonEntitlement.handler";
import { ListAddonEntitlementsHandler } from "@/modules/addon_entitlements/application/use-cases/ListAddonEntitlements/ListAddonEntitlements.handler";
import { GetAddonEntitlementHandler } from "@/modules/addon_entitlements/application/use-cases/GetAddonEntitlement/GetAddonEntitlement.handler";

import { PostgresCustomerRepository } from "@/modules/customers/infrastructure/adapters/PostgresCustomerRepository";
import { CreateCustomerHandler } from "@/modules/customers/application/use-cases/CreateCustomer/CreateCustomer.handler";
import { ListCustomersHandler } from "@/modules/customers/application/use-cases/ListCustomers/ListCustomers.handler";
import { CreateManyCustomersHandler } from "@/modules/customers/application/use-cases/CreateManyCustomers/CreateManyCustomers.handler";
import { DeleteCustomerHandler } from "@/modules/customers/application/use-cases/DeleteCustomer/DeleteCustomer.handler";

import { PostgresSubscriptionRepo } from "@/modules/subscriptions/infrastructure/adapters/PostgresSubscriptionRepo";
import { CreateSubscriptionHandler } from "@/modules/subscriptions/application/use-cases/CreateSubscription/CreateSubscription.handler";
import { CancelSubscriptionHandler } from "@/modules/subscriptions/application/use-cases/CancelSubscription/CancelSubscription.handler";
import { UpdateSubscriptionHandler } from "@/modules/subscriptions/application/use-cases/UpdateSubscription/UpdateSubscription.handler";
import { ListCustomerSubscriptionsHandler } from "@/modules/subscriptions/application/use-cases/ListCustomerSubscriptions/ListCustomerSubscriptions.handler";
import { ListSubscriptionsHandler } from "@/modules/subscriptions/application/use-cases/ListSubscriptions/ListSubscriptions.handler";
import { GetSubscriptionHandler } from "@/modules/subscriptions/application/use-cases/GetSubscription/GetSubscription.handler";

import { PostgresUsageRepo } from "@/modules/usage/infrastructure/adapters/PostgresUsageRepo";
import { RecordUsageHandler } from "@/modules/usage/application/use-cases/RecordUsage/RecordUsage.handler";
import { CreateUsageMeterHandler } from "@/modules/usage/application/use-cases/CreateUsageMeter/CreateUsageMeter.handler";
import { UpdateUsageMeterHandler } from "@/modules/usage/application/use-cases/UpdateUsageMeter/UpdateUsageMeter.handler";
import { ListUsagesHandler } from "@/modules/usage/application/use-cases/ListUsages/ListUsages.handler";
import { GetUsageMeterHandler } from "@/modules/usage/application/use-cases/GetUsageMeter/GetUsageMeter.handler";

import { PostgresWalletRepo } from "@/modules/wallets/infrastructure/adapters/PostgresWalletRepo";
import { CreditWalletHandler } from "@/modules/wallets/application/use-cases/CreditWallet/CreditWallet.handler";
import { DebitWalletHandler } from "@/modules/wallets/application/use-cases/DebitWallet/DebitWallet.handler";
import { GetWalletBalanceHandler } from "@/modules/wallets/application/use-cases/GetWalletBalance/GetWalletBalance.handler";
import { ListWalletTransactionsHandler } from "@/modules/wallets/application/use-cases/ListWalletTransactions/ListWalletTransactions.handler";

import { PostgresInvoiceRepo } from "@/modules/invoices/infrastructure/adapters/PostgresInvoiceRepo";
import { CreateDraftInvoiceHandler } from "@/modules/invoices/application/use-cases/CreateDraftInvoice/CreateDraftInvoice.handler";
import { UpdateInvoiceHandler } from "@/modules/invoices/application/use-cases/UpdateInvoice/UpdateInvoice.handler";
import { FinalizeInvoiceHandler } from "@/modules/invoices/application/use-cases/FinalizeInvoice/FinalizeInvoice.handler";
import { VoidInvoiceHandler } from "@/modules/invoices/application/use-cases/VoidInvoice/VoidInvoice.handler";
import { ListInvoicesHandler } from "@/modules/invoices/application/use-cases/ListInvoices/ListInvoices.handler";
import { GetInvoiceHandler } from "@/modules/invoices/application/use-cases/GetInvoice/GetInvoice.handler";
import { ProcessPaymentHandler } from "@/modules/payments/application/use-cases/ProcessPayment/ProcessPayment.handler";
import { AddInvoiceLineItemHandler } from "@/modules/invoices/application/use-cases/AddInvoiceLineItem/AddInvoiceLineItem.handler";
import { UpdateInvoiceLineItemHandler } from "@/modules/invoices/application/use-cases/UpdateInvoiceLineItem/UpdateInvoiceLineItem.handler";
import { DeleteInvoiceLineItemHandler } from "@/modules/invoices/application/use-cases/DeleteInvoiceLineItem/DeleteInvoiceLineItem.handler";

import { PostgresPaymentRepo } from "@/modules/payments/infrastructure/adapters/PostgresPaymentRepo";
import { GetPaymentHandler } from "@/modules/payments/application/use-cases/GetPayment/GetPayment.handler";
import { ListPaymentsHandler } from "@/modules/payments/application/use-cases/ListPayments/ListPayments.handler";

import { PostgresRefundRepo } from "@/modules/refunds/infrastructure/adapters/PostgresRefundRepo";
import { CreateRefundHandler } from "@/modules/refunds/application/use-cases/CreateRefund/CreateRefund.handler";
import { UpdateRefundHandler } from "@/modules/refunds/application/use-cases/UpdateRefund/UpdateRefund.handler";
import { ListRefundsHandler } from "@/modules/refunds/application/use-cases/ListRefunds/ListRefunds.handler";
import { GetRefundHandler } from "@/modules/refunds/application/use-cases/GetRefund/GetRefund.handler";

import { PostgresCreditNoteRepo } from "@/modules/credit_notes/infrastructure/adapters/PostgresCreditNoteRepo";
import { CreateCreditNoteHandler } from "@/modules/credit_notes/application/use-cases/CreateCreditNote/CreateCreditNote.handler";
import { ListCreditNotesHandler } from "@/modules/credit_notes/application/use-cases/ListCreditNotes/ListCreditNotes.handler";
import { GetCreditNoteHandler } from "@/modules/credit_notes/application/use-cases/GetCreditNote/GetCreditNote.handler";

import { PostgresWebhookEndpointRepo } from "@/modules/webhooks/infrastructure/adapters/PostgresWebhookEndpointRepo";
import { CreateWebhookEndpointHandler } from "@/modules/webhooks/application/use-cases/CreateWebhookEndpoint/CreateWebhookEndpoint.handler";
import { ListWebhookEndpointsHandler } from "@/modules/webhooks/application/use-cases/ListWebhookEndpoints/ListWebhookEndpoints.handler";
import { DeactivateWebhookEndpointHandler } from "@/modules/webhooks/application/use-cases/DeactivateWebhookEndpoint/DeactivateWebhookEndpoint.handler";
import { RotateWebhookSecretHandler } from "@/modules/webhooks/application/use-cases/RotateWebhookSecret/RotateWebhookSecret.handler";
import { ListWebhookDeliveriesHandler } from "@/modules/webhooks/application/use-cases/ListWebhookDeliveries/ListWebhookDeliveries.handler";

import { CreateApiKeyHandler } from "@/modules/system/application/use-cases/CreateApiKey/CreateApiKey.handler";
import { VerifyApiKeyHandler } from "@/modules/system/application/use-cases/VerifyApiKey/VerifyApiKey.handler";
import { ListApiKeysHandler } from "@/modules/system/application/use-cases/ListApiKeys/ListApiKeys.handler";
import { GetApiKeyHandler } from "@/modules/system/application/use-cases/GetApiKey/GetApiKey.handler";
import { UpdateApiKeyHandler } from "@/modules/system/application/use-cases/UpdateApiKey/UpdateApiKey.handler";
import { RotateApiKeyHandler } from "@/modules/system/application/use-cases/RotateApiKey/RotateApiKey.handler";
import { DeleteApiKeyHandler } from "@/modules/system/application/use-cases/DeleteApiKey/DeleteApiKey.handler";

import { CreateEnvironmentHandler } from "@/modules/environments/application/use-cases/CreateEnvironment/CreateEnvironment.handler";
import { UpdateEnvironmentHandler } from "@/modules/environments/application/use-cases/UpdateEnvironment/UpdateEnvironment.handler";
import { GetEnvironmentHandler } from "@/modules/environments/application/use-cases/GetEnvironment/GetEnvironment.handler";
import { ListEnvironmentsHandler } from "@/modules/environments/application/use-cases/ListEnvironments/ListEnvironments.handler";

import { PutAuthConfigHandler } from "@/modules/auth/application/use-cases/PutAuthConfig/PutAuthConfig.handler";
import { ListAuthConfigsHandler } from "@/modules/auth/application/use-cases/ListAuthConfigs/ListAuthConfigs.handler";
import { GetAuthConfigHandler } from "@/modules/auth/application/use-cases/GetAuthConfig/GetAuthConfig.handler";

import { CreateStudioAdminHandler } from "@/modules/studio/application/use-cases/CreateStudioAdmin/CreateStudioAdmin.handler";
import { UpdateStudioAdminHandler } from "@/modules/studio/application/use-cases/UpdateStudioAdmin/UpdateStudioAdmin.handler";
import { ListStudioAdminsHandler } from "@/modules/studio/application/use-cases/ListStudioAdmins/ListStudioAdmins.handler";
import { GetStudioAdminHandler } from "@/modules/studio/application/use-cases/GetStudioAdmin/GetStudioAdmin.handler";

import { ListAuditLogsHandler } from "@/modules/audit/application/use-cases/ListAuditLogs/ListAuditLogs.handler";
import { GetAuditLogHandler } from "@/modules/audit/application/use-cases/GetAuditLog/GetAuditLog.handler";

import { CreateUserHandler } from "@/modules/users/application/use-cases/CreateUser/CreateUser.handler";
import { UpdateUserHandler } from "@/modules/users/application/use-cases/UpdateUser/UpdateUser.handler";
import { ListUsersHandler } from "@/modules/users/application/use-cases/ListUsers/ListUsers.handler";
import { GetUserHandler } from "@/modules/users/application/use-cases/GetUser/GetUser.handler";

import { PostgresIntegrationRepo } from "@/modules/integrations/infrastructure/adapters/PostgresIntegrationRepo";
import { DummyProviderAdapter } from "@/modules/integrations/infrastructure/adapters/DummyProviderAdapter";
import { InstallIntegrationHandler } from "@/modules/integrations/application/use-cases/InstallIntegration/InstallIntegration.handler";
import { UpdateIntegrationConfigHandler } from "@/modules/integrations/application/use-cases/UpdateIntegrationConfig/UpdateIntegrationConfig.handler";
import { ListIntegrationsHandler } from "@/modules/integrations/application/use-cases/ListIntegrations/ListIntegrations.handler";
import { GetIntegrationHandler } from "@/modules/integrations/application/use-cases/GetIntegration/GetIntegration.handler";

import { PostgresProviderEventRepo } from "@/modules/provider_events/infrastructure/adapters/PostgresProviderEventRepo";
import { CreateProviderEventHandler } from "@/modules/provider_events/application/use-cases/CreateProviderEvent/CreateProviderEvent.handler";
import { ListProviderEventsHandler } from "@/modules/provider_events/application/use-cases/ListProviderEvents/ListProviderEvents.handler";
import { GetProviderEventHandler } from "@/modules/provider_events/application/use-cases/GetProviderEvent/GetProviderEvent.handler";

import { db as PgDatabase } from "@revstackhq/db";
import { PostgresApiKeyRepository } from "@/modules/system/infrastructure/adapters/PostgresApiKeyRepository";
import { AccessService } from "@/modules/access/application/AccessService";
import { DeleteEnvironmentHandler } from "@/modules/environments/application/use-cases/DeleteEnvironment/DeleteEnvironment.handler";

export type AppEnv = {
  Variables: ReturnType<typeof buildContainer> & {
    environmentId: string;
    actorId?: string;
    scopes: string[];
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
    entitlements: new PostgresEntitlementRepo(db),
    planEntitlements: new PostgresPlanEntitlementRepo(db),
    addonEntitlements: new PostgresAddonEntitlementRepo(db),
    plans: new PostgresPlanRepo(db),
    prices: new PostgresPriceRepo(db),
    addons: new PostgresAddonRepo(db),
    coupons: new PostgresCouponRepo(db),
    customers: new PostgresCustomerRepository(db),
    subscriptions: new PostgresSubscriptionRepo(db),
    usage: new PostgresUsageRepo(db),
    wallets: new PostgresWalletRepo(db),
    invoices: new PostgresInvoiceRepo(db),
    payments: new PostgresPaymentRepo(db),
    refunds: new PostgresRefundRepo(db),
    creditNotes: new PostgresCreditNoteRepo(db),
    webhooks: new PostgresWebhookEndpointRepo(db),
    apiKeys: new PostgresApiKeyRepository(db),
    environments: new PostgresEnvironmentRepository(db),
    authConfigs: new PostgresAuthConfigRepo(db),
    studioAdmins: new PostgresStudioAdminRepo(db),
    auditLogs: new PostgresAuditLogRepo(db),
    users: new PostgresUserRepo(db),
    integrations: new PostgresIntegrationRepo(db),
    providerEvents: new PostgresProviderEventRepo(db),
  };

  return {
    accessService: new AccessService(repos.apiKeys),
    entitlements: {
      get create() {
        return new CreateEntitlementHandler(
          repos.entitlements,
          eventBus,
          cache,
        );
      },
      get delete() {
        return new DeleteEntitlementHandler(repos.entitlements, eventBus);
      },
      get list() {
        return new ListEntitlementsHandler(repos.entitlements, cache);
      },
    },
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
    planEntitlements: {
      get create() {
        return new CreatePlanEntitlementHandler(
          repos.planEntitlements,
          eventBus,
        );
      },
      get updateLimits() {
        return new UpdatePlanEntitlementLimitsHandler(
          repos.planEntitlements,
          eventBus,
        );
      },
      get delete() {
        return new DeletePlanEntitlementHandler(
          repos.planEntitlements,
          eventBus,
        );
      },
      get list() {
        return new ListPlanEntitlementsHandler(repos.planEntitlements);
      },
      get get() {
        return new GetPlanEntitlementHandler(repos.planEntitlements);
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
    addons: {
      get create() {
        return new CreateAddonHandler(repos.addons, eventBus);
      },
      get createMany() {
        return new CreateManyAddonsHandler(repos.addons, eventBus);
      },
      get archive() {
        return new ArchiveAddonHandler(repos.addons);
      },
      get list() {
        return new ListAddonsHandler(repos.addons);
      },
      get get() {
        return new GetAddonHandler(repos.addons);
      },
    },
    addonEntitlements: {
      get create() {
        return new CreateAddonEntitlementHandler(
          repos.addonEntitlements,
          eventBus,
        );
      },
      get delete() {
        return new DeleteAddonEntitlementHandler(
          repos.addonEntitlements,
          eventBus,
        );
      },
      get list() {
        return new ListAddonEntitlementsHandler(repos.addonEntitlements);
      },
      get get() {
        return new GetAddonEntitlementHandler(repos.addonEntitlements);
      },
    },
    coupons: {
      get create() {
        return new CreateCouponHandler(repos.coupons, eventBus);
      },
      get update() {
        return new UpdateCouponHandler(repos.coupons, eventBus);
      },
      get archive() {
        return new ArchiveCouponHandler(repos.coupons, eventBus);
      },
      get delete() {
        return new DeleteCouponHandler(repos.coupons, eventBus);
      },
      get list() {
        return new ListCouponsHandler(repos.coupons);
      },
      get get() {
        return new GetCouponHandler(repos.coupons);
      },
    },
    customers: {
      get create() {
        return new CreateCustomerHandler(repos.customers, eventBus, cache);
      },
      get list() {
        return new ListCustomersHandler(repos.customers, cache);
      },
      get createMany() {
        return new CreateManyCustomersHandler(repos.customers, eventBus);
      },
      get delete() {
        return new DeleteCustomerHandler(repos.customers, eventBus);
      },
    },
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
    studio: {
      get createAdmin() {
        return new CreateStudioAdminHandler(repos.studioAdmins, eventBus);
      },
      get updateAdmin() {
        return new UpdateStudioAdminHandler(repos.studioAdmins);
      },
      get listAdmins() {
        return new ListStudioAdminsHandler(repos.studioAdmins);
      },
      get getAdmin() {
        return new GetStudioAdminHandler(repos.studioAdmins);
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
