import { revstack } from "@/schema/namespace";
import {
  FEATURE_TYPES,
  UNIT_TYPES,
  PLAN_TYPES,
  STATUSES,
  SUBSCRIPTION_STATUSES,
  BILLING_INTERVALS,
  RESET_PERIODS,
  PRICING_TYPES,
  ADDON_ENTITLEMENT_TYPES,
} from "@revstackhq/core";

export const apiKeyTypeEnum = revstack.enum("api_key_type", [
  "secret",
  "public",
]);

export const workspaceRoleEnum = revstack.enum("workspace_role", [
  "owner",
  "admin",
  "viewer",
]);

export const entitlementTypeEnum = revstack.enum(
  "entitlement_type",
  FEATURE_TYPES as unknown as [string, ...string[]],
);

export const unitTypeEnum = revstack.enum(
  "unit_type",
  UNIT_TYPES as unknown as [string, ...string[]],
);

export const integrationModeEnum = revstack.enum("integration_mode", [
  "sandbox",
  "production",
]);

export const planTypeEnum = revstack.enum(
  "plan_type",
  PLAN_TYPES as unknown as [string, ...string[]],
);

export const statusEnum = revstack.enum(
  "status",
  STATUSES as unknown as [string, ...string[]],
);

export const subscriptionStatusEnum = revstack.enum(
  "subscription_status",
  SUBSCRIPTION_STATUSES as unknown as [string, ...string[]],
);

export const billingIntervalEnum = revstack.enum(
  "billing_interval",
  BILLING_INTERVALS as unknown as [string, ...string[]],
);

export const resetPeriodEnum = revstack.enum(
  "reset_period",
  RESET_PERIODS as unknown as [string, ...string[]],
);

export const pricingTypeEnum = revstack.enum(
  "pricing_type",
  PRICING_TYPES as unknown as [string, ...string[]],
);

export const discountTypeEnum = revstack.enum("discount_type", [
  "percentage",
  "fixed_amount",
]);

export const disputeStatusEnum = revstack.enum("dispute_status", [
  "needs_response",
  "under_review",
  "won",
  "lost",
  "warning",
]);

export const paymentMethodStatusEnum = revstack.enum("payment_method_status", [
  "active",
  "expired",
  "failed",
]);

export const creditNoteReasonEnum = revstack.enum("credit_note_reason", [
  "duplicate",
  "fraudulent",
  "order_change",
  "product_unsatisfactory",
  "other",
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

export const discountStatusEnum = revstack.enum("discount_status", [
  "active",
  "inactive",
  "archived",
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

/**
 * Represents a distinct feature or resource limit granted to users within the system.
 */
export const entitlementStatusEnum = revstack.enum("entitlement_status", [
  "draft",
  "active",
  "archived",
]);

export const addonTypeEnum = revstack.enum(
  "addon_type",
  PRICING_TYPES as unknown as [string, ...string[]],
);

export const addonEntitlementTypeEnum = revstack.enum(
  "addon_entitlement_type",
  ADDON_ENTITLEMENT_TYPES as unknown as [string, ...string[]],
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
