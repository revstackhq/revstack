import { revstack } from "@/schema/namespace";

export const apiKeyTypeEnum = revstack.enum("api_key_type", [
  "secret",
  "public",
]);

export const entitlementTypeEnum = revstack.enum("entitlement_type", [
  "boolean",
  "metered",
  "static",
  "json",
]);

export const unitTypeEnum = revstack.enum("unit_type", [
  "count",
  "bytes",
  "seconds",
  "tokens",
  "requests",
  "custom",
]);

export const planTypeEnum = revstack.enum("plan_type", [
  "paid",
  "free",
  "custom",
]);

export const statusEnum = revstack.enum("status", [
  "active",
  "inactive",
  "archived",
  "draft",
]);

export const subscriptionStatusEnum = revstack.enum("subscription_status", [
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "paused",
  "unpaid",
  "revoked",
  "canceled",
]);

export const billingIntervalEnum = revstack.enum("billing_interval", [
  "monthly",
  "quarterly",
  "yearly",
  "one_time",
]);

export const resetPeriodEnum = revstack.enum("reset_period", [
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
]);

export const pricingTypeEnum = revstack.enum("pricing_type", [
  "recurring",
  "one_time",
]);

export const discountTypeEnum = revstack.enum("discount_type", [
  "percent",
  "amount",
]);

export const paymentStatusEnum = revstack.enum("payment_status", [
  "pending",
  "requires_action",
  "processing",
  "authorized",
  "succeeded",
  "failed",
  "canceled",
  "refunded",
  "partially_refunded",
  "disputed",
]);

export const refundStatusEnum = revstack.enum("refund_status", [
  "pending",
  "succeeded",
  "failed",
  "canceled",
]);

export const creditNoteStatusEnum = revstack.enum("credit_note_status", [
  "issued",
  "void",
]);

export const discountDurationEnum = revstack.enum("discount_duration", [
  "once",
  "forever",
  "repeating",
]);

export const walletTxTypeEnum = revstack.enum("wallet_tx_type", [
  "credit",
  "debit",
]);

export const authProviderEnum = revstack.enum("auth_provider", [
  "auth0",
  "clerk",
  "supabase",
  "cognito",
  "firebase",
  "custom",
]);

export const signingStrategyEnum = revstack.enum("signing_strategy", [
  "RS256",
  "HS256",
]);

export const addonTypeEnum = revstack.enum("addon_type", [
  "recurring",
  "one_time",
]);

export const addonEntitlementTypeEnum = revstack.enum(
  "addon_entitlement_type",
  ["increment", "set"],
);

export const processingStatusEnum = revstack.enum("processing_status", [
  "idle",
  "processing",
  "failed",
]);

/**
 * Defines the type of an invoice line item.
 * - `subscription`: Standard recurring subscription charge.
 * - `one_time_charge`: One-time charge.
 * - `overage`: Usage-based overage charge.
 * - `addon`: Additional fixed-price item or service.
 * - `setup_fee`: One-time initial setup fee.
 * - `proration`: Prorated charge or credit for mid-cycle changes.
 */
export const invoiceLineItemTypeEnum = revstack.enum("invoice_line_item_type", [
  "subscription",
  "one_time_charge",
  "overage",
  "addon",
  "setup_fee",
  "proration",
]);

export const invoiceStatusEnum = revstack.enum("invoice_status", [
  "draft",
  "open",
  "paid",
  "uncollectible",
  "void",
]);

export const billingSchemeEnum = revstack.enum("billing_scheme", [
  "flat",
  "per_unit",
  "tiered_volume",
  "tiered_graduated",
  "metered",
  "custom",
  "free",
]);

export const usageActionEnum = revstack.enum("usage_action", [
  "increment",
  "decrement",
  "set",
]);

export const eventTypeEnum = revstack.enum("event_type", [
  "PAYMENT_CREATED",
  "PAYMENT_AUTHORIZED",
  "PAYMENT_CAPTURED",
  "PAYMENT_PROCESSING",
  "PAYMENT_SUCCEEDED",
  "PAYMENT_FAILED",
  "PAYMENT_CANCELED",
  "REFUND_CREATED",
  "REFUND_PROCESSED",
  "REFUND_FAILED",
  "DISPUTE_CREATED",
  "DISPUTE_UPDATED",
  "DISPUTE_WON",
  "DISPUTE_LOST",
  "CHECKOUT_CREATED",
  "CHECKOUT_COMPLETED",
  "CHECKOUT_EXPIRED",
  "CHECKOUT_CANCELED",
  "SUBSCRIPTION_CREATED",
  "SUBSCRIPTION_UPDATED",
  "SUBSCRIPTION_RENEWED",
  "SUBSCRIPTION_PAST_DUE",
  "SUBSCRIPTION_CANCELED",
  "SUBSCRIPTION_REVOKED",
  "SUBSCRIPTION_PAUSED",
  "SUBSCRIPTION_RESUMED",
  "SUBSCRIPTION_TRIAL_WILL_END",
  "INVOICE_CREATED",
  "INVOICE_FINALIZED",
  "INVOICE_PAID",
  "INVOICE_PAYMENT_FAILED",
  "INVOICE_VOIDED",
  "INVOICE_UNCOLLECTIBLE",
  "CUSTOMER_CREATED",
  "CUSTOMER_UPDATED",
  "CUSTOMER_DELETED",
  "PAYMENT_METHOD_ATTACHED",
  "PAYMENT_METHOD_UPDATED",
  "PAYMENT_METHOD_DETACHED",
  "MANDATE_CREATED",
  "MANDATE_REVOKED",
  "PRODUCT_CREATED",
  "PRODUCT_UPDATED",
  "PRODUCT_DELETED",
  "PRICE_CREATED",
  "PRICE_UPDATED",
  "PRICE_DELETED",
]);
