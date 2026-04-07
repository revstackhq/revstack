export const FEATURE_TYPES = ["boolean", "static", "metered", "json"] as const;

export const UNIT_TYPES = [
  "count",
  "bytes",
  "seconds",
  "tokens",
  "requests",
  "custom",
] as const;

export const PLAN_TYPES = ["paid", "free", "custom"] as const;

export const STATUSES = ["active", "inactive", "archived", "draft"] as const;

export const SUBSCRIPTION_STATUSES = [
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "paused",
  "unpaid",
  "revoked",
  "canceled",
] as const;

export const BILLING_INTERVALS = ["day", "week", "month", "year"] as const;

export const RESET_PERIODS = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
] as const;

export const PRICING_TYPES = ["recurring", "one_time"] as const;

export const ADDON_ENTITLEMENT_TYPES = ["increment", "set"] as const;

export const CHECK_RESULT_REASONS = [
  "feature_missing",
  "limit_reached",
  "past_due",
  "included",
  "overage_allowed",
] as const;

// ---------------------------------------------------------------------------
// Domain Events — Single Source of Truth
// Every event emitted in the system MUST be registered here.
// ---------------------------------------------------------------------------

export const DOMAIN_EVENTS = {
  // --- Addons ---
  ADDON_CREATED: "addon.created",
  ADDON_ARCHIVED: "addon.archived",
  ADDON_ENTITLEMENT_CREATED: "addon_entitlement.created",
  ADDON_ENTITLEMENT_DELETED: "addon_entitlement.deleted",

  // --- API Keys ---
  API_KEY_CREATED: "api_key.created",
  API_KEY_UPDATED: "api_key.updated",
  API_KEY_DELETED: "api_key.deleted",
  API_KEY_ROTATED: "api_key.rotated",

  // --- Audit ---
  AUDIT_LOG_CREATED: "audit.log.created",

  // --- Coupons ---
  COUPON_CREATED: "coupon.created",
  COUPON_ARCHIVED: "coupon.archived",
  COUPON_DELETED: "coupon.deleted",
  COUPON_UPDATED: "coupon.updated",

  // --- Customers ---
  CUSTOMER_CREATED: "customer.created",
  CUSTOMER_DELETED: "customer.deleted",
  CUSTOMER_UPDATED: "customer.updated",
  CUSTOMER_ARCHIVED: "customer.archived",

  // --- Entitlements ---
  ENTITLEMENT_CREATED: "entitlement.created",
  ENTITLEMENT_UPDATED: "entitlement.updated",
  ENTITLEMENT_ARCHIVED: "entitlement.archived",
  ENTITLEMENT_DELETED: "entitlement.deleted",

  // --- Environments ---
  ENVIRONMENT_CREATED: "environment.created",
  ENVIRONMENT_UPDATED: "environment.updated",
  ENVIRONMENT_DELETED: "environment.deleted",

  // --- Identity Providers ---
  AUTH_CONFIG_UPDATED: "auth_config.updated",

  // --- Integrations ---
  INTEGRATION_INSTALLED: "integration.installed",
  INTEGRATION_CONFIG_UPDATED: "integration.config.updated",

  // --- Invoices ---
  INVOICE_CREATED: "invoice.created",
  INVOICE_FINALIZED: "invoice.finalized",
  INVOICE_VOIDED: "invoice.voided",
  INVOICE_LINE_CREATED: "invoice_line.created",

  // --- Payments ---
  PAYMENT_PROCESSED: "payment.processed",

  // --- Plans ---
  PLAN_CREATED: "plan.created",
  PLAN_ENTITLEMENT_CREATED: "plan_entitlement.created",

  // --- Prices ---
  PRICE_CREATED: "price.created",
  PRICE_UPDATED: "price.updated",
  PRICE_VERSIONED: "price.versioned",

  // --- Provider Events ---
  PROVIDER_EVENT_RECEIVED: "provider_event.received",

  // --- Refunds ---
  REFUND_CREATED: "refund.created",
  REFUND_UPDATED: "refund.updated",

  // --- Subscriptions ---
  SUBSCRIPTION_CREATED: "subscription.created",
  SUBSCRIPTION_CANCELLED: "subscription.cancelled",
  SUBSCRIPTION_UPDATED: "subscription.updated",

  // --- Usage ---
  USAGE_RECORDED: "usage.recorded",
  USAGE_METER_CREATED: "usage_meter.created",
  USAGE_METER_UPDATED: "usage_meter.updated",

  // --- Users ---
  USER_CREATED: "user.created",
  USER_UPDATED: "user.updated",

  // --- Wallets ---
  WALLET_CREDITED: "wallet.credited",
  WALLET_DEBITED: "wallet.debited",

  // --- Webhooks ---
  WEBHOOK_ENDPOINT_CREATED: "webhook.endpoint.created",

  // --- Workspaces ---
  WORKSPACE_MEMBER_CREATED: "workspace.member.created",
} as const;

export type DomainEventName =
  (typeof DOMAIN_EVENTS)[keyof typeof DOMAIN_EVENTS];
