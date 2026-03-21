CREATE SCHEMA "revstack";
--> statement-breakpoint
CREATE TYPE "revstack"."addon_entitlement_type" AS ENUM('increment', 'set');--> statement-breakpoint
CREATE TYPE "revstack"."addon_type" AS ENUM('recurring', 'one_time');--> statement-breakpoint
CREATE TYPE "revstack"."auth_provider" AS ENUM('auth0', 'clerk', 'supabase', 'cognito', 'firebase', 'custom');--> statement-breakpoint
CREATE TYPE "revstack"."billing_interval" AS ENUM('monthly', 'quarterly', 'yearly', 'one_time');--> statement-breakpoint
CREATE TYPE "revstack"."billing_scheme" AS ENUM('flat', 'per_unit', 'tiered_volume', 'tiered_graduated', 'metered', 'custom', 'free');--> statement-breakpoint
CREATE TYPE "revstack"."credit_note_status" AS ENUM('issued', 'void');--> statement-breakpoint
CREATE TYPE "revstack"."discount_duration" AS ENUM('once', 'forever', 'repeating');--> statement-breakpoint
CREATE TYPE "revstack"."discount_type" AS ENUM('percent', 'amount');--> statement-breakpoint
CREATE TYPE "revstack"."entitlement_type" AS ENUM('boolean', 'metered', 'static', 'json');--> statement-breakpoint
CREATE TYPE "revstack"."event_type" AS ENUM('PAYMENT_CREATED', 'PAYMENT_AUTHORIZED', 'PAYMENT_CAPTURED', 'PAYMENT_PROCESSING', 'PAYMENT_SUCCEEDED', 'PAYMENT_FAILED', 'PAYMENT_CANCELED', 'REFUND_CREATED', 'REFUND_PROCESSED', 'REFUND_FAILED', 'DISPUTE_CREATED', 'DISPUTE_UPDATED', 'DISPUTE_WON', 'DISPUTE_LOST', 'CHECKOUT_CREATED', 'CHECKOUT_COMPLETED', 'CHECKOUT_EXPIRED', 'CHECKOUT_CANCELED', 'SUBSCRIPTION_CREATED', 'SUBSCRIPTION_UPDATED', 'SUBSCRIPTION_RENEWED', 'SUBSCRIPTION_PAST_DUE', 'SUBSCRIPTION_CANCELED', 'SUBSCRIPTION_REVOKED', 'SUBSCRIPTION_PAUSED', 'SUBSCRIPTION_RESUMED', 'SUBSCRIPTION_TRIAL_WILL_END', 'INVOICE_CREATED', 'INVOICE_FINALIZED', 'INVOICE_PAID', 'INVOICE_PAYMENT_FAILED', 'INVOICE_VOIDED', 'INVOICE_UNCOLLECTIBLE', 'CUSTOMER_CREATED', 'CUSTOMER_UPDATED', 'CUSTOMER_DELETED', 'PAYMENT_METHOD_ATTACHED', 'PAYMENT_METHOD_UPDATED', 'PAYMENT_METHOD_DETACHED', 'MANDATE_CREATED', 'MANDATE_REVOKED', 'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED', 'PRICE_CREATED', 'PRICE_UPDATED', 'PRICE_DELETED');--> statement-breakpoint
CREATE TYPE "revstack"."invoice_line_item_type" AS ENUM('subscription', 'overage', 'addon', 'setup_fee', 'proration');--> statement-breakpoint
CREATE TYPE "revstack"."invoice_status" AS ENUM('draft', 'open', 'paid', 'uncollectible', 'void');--> statement-breakpoint
CREATE TYPE "revstack"."payment_status" AS ENUM('pending', 'requires_action', 'processing', 'authorized', 'succeeded', 'failed', 'canceled', 'refunded', 'partially_refunded', 'disputed');--> statement-breakpoint
CREATE TYPE "revstack"."plan_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "revstack"."plan_type" AS ENUM('paid', 'free', 'custom');--> statement-breakpoint
CREATE TYPE "revstack"."pricing_type" AS ENUM('recurring', 'one_time');--> statement-breakpoint
CREATE TYPE "revstack"."refund_status" AS ENUM('pending', 'succeeded', 'failed', 'canceled');--> statement-breakpoint
CREATE TYPE "revstack"."reset_period" AS ENUM('daily', 'weekly', 'monthly', 'yearly', 'never');--> statement-breakpoint
CREATE TYPE "revstack"."signing_strategy" AS ENUM('RS256', 'HS256');--> statement-breakpoint
CREATE TYPE "revstack"."subscription_status" AS ENUM('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'paused', 'unpaid', 'revoked', 'canceled');--> statement-breakpoint
CREATE TYPE "revstack"."unit_type" AS ENUM('count', 'bytes', 'seconds', 'tokens', 'requests', 'custom');--> statement-breakpoint
CREATE TYPE "revstack"."wallet_tx_type" AS ENUM('credit', 'debit');--> statement-breakpoint
CREATE TABLE "revstack"."api_keys" (
	"key" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."auth_configs" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"provider" "revstack"."auth_provider" NOT NULL,
	"strategy" "revstack"."signing_strategy" NOT NULL,
	"jwks_uri" text,
	"signing_secret" text,
	"issuer" text,
	"audience" text,
	"user_id_claim" text DEFAULT 'sub' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."environments" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."integrations" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"provider" text NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."addon_entitlements" (
	"id" text PRIMARY KEY NOT NULL,
	"addon_id" text NOT NULL,
	"entitlement_id" text NOT NULL,
	"value_limit" integer,
	"type" "revstack"."addon_entitlement_type" DEFAULT 'increment' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."addons" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "revstack"."addon_type" NOT NULL,
	"billing_interval" "revstack"."billing_interval",
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."coupons" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"code" text NOT NULL,
	"name" text,
	"type" "revstack"."discount_type" NOT NULL,
	"value" integer NOT NULL,
	"duration" "revstack"."discount_duration" NOT NULL,
	"duration_in_months" integer,
	"max_redemptions" integer,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "revstack"."entitlements" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "revstack"."entitlement_type" NOT NULL,
	"unit_type" "revstack"."unit_type" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."plan_entitlements" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"entitlement_id" text NOT NULL,
	"meter_id" text,
	"value_limit" integer,
	"value_bool" boolean,
	"value_text" text,
	"value_json" jsonb,
	"is_hard_limit" boolean DEFAULT true NOT NULL,
	"reset_period" "revstack"."reset_period"
);
--> statement-breakpoint
CREATE TABLE "revstack"."plans" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "revstack"."plan_type" DEFAULT 'paid' NOT NULL,
	"status" "revstack"."plan_status" DEFAULT 'active' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."prices" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"type" "revstack"."pricing_type" DEFAULT 'recurring' NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"billing_interval" "revstack"."billing_interval" NOT NULL,
	"interval_count" integer DEFAULT 1 NOT NULL,
	"trial_period_days" integer DEFAULT 0 NOT NULL,
	"billing_scheme" "revstack"."billing_scheme" DEFAULT 'flat' NOT NULL,
	"tiers" jsonb,
	"minimum_amount" integer,
	"unit_label" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"overage_config" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."customers" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"external_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"phone" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"external_id" text,
	"is_guest" boolean DEFAULT false NOT NULL,
	"email" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."subscription_addons" (
	"id" text PRIMARY KEY NOT NULL,
	"subscription_id" text NOT NULL,
	"addon_id" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."subscription_coupons" (
	"id" text PRIMARY KEY NOT NULL,
	"subscription_id" text NOT NULL,
	"coupon_id" text NOT NULL,
	"applied_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "revstack"."subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"price_id" text,
	"status" "revstack"."subscription_status" NOT NULL,
	"current_period_start" timestamp with time zone NOT NULL,
	"current_period_end" timestamp with time zone NOT NULL,
	"billing_cycle_anchor" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"canceled_at" timestamp with time zone,
	"trial_start" timestamp with time zone,
	"trial_end" timestamp with time zone,
	"external_subscription_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."usages" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"entitlement_id" text NOT NULL,
	"amount" integer DEFAULT 1 NOT NULL,
	"idempotency_key" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "revstack"."wallet_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"wallet_id" text NOT NULL,
	"amount" numeric(20, 4) NOT NULL,
	"type" "revstack"."wallet_tx_type" NOT NULL,
	"description" text NOT NULL,
	"reference_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."wallets" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"entitlement_id" text NOT NULL,
	"balance" numeric(20, 4) DEFAULT '0' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."credit_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"invoice_id" text NOT NULL,
	"refund_id" text,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "revstack"."credit_note_status" DEFAULT 'issued' NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."invoice_line_items" (
	"id" text PRIMARY KEY NOT NULL,
	"invoice_id" text NOT NULL,
	"price_id" text,
	"addon_id" text,
	"name" text NOT NULL,
	"description" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_amount" integer NOT NULL,
	"amount" integer NOT NULL,
	"type" "revstack"."invoice_line_item_type" NOT NULL,
	"period_start" timestamp with time zone,
	"period_end" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "revstack"."invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"subscription_id" text,
	"amount" integer NOT NULL,
	"subtotal" integer DEFAULT 0 NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"tax" integer DEFAULT 0 NOT NULL,
	"amount_due" integer DEFAULT 0 NOT NULL,
	"amount_paid" integer DEFAULT 0 NOT NULL,
	"amount_remaining" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "revstack"."invoice_status" NOT NULL,
	"billing_reason" text,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."payments" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"invoice_id" text,
	"customer_id" text,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "revstack"."payment_status" NOT NULL,
	"provider_id" text NOT NULL,
	"external_id" text,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."provider_events" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"provider_event_id" text NOT NULL,
	"type" "revstack"."event_type" NOT NULL,
	"resource_id" text NOT NULL,
	"customer_id" text,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."refunds" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"payment_id" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "revstack"."refund_status" NOT NULL,
	"reason" text,
	"external_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "revstack"."api_keys" ADD CONSTRAINT "api_keys_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."auth_configs" ADD CONSTRAINT "auth_configs_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."integrations" ADD CONSTRAINT "integrations_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."addon_entitlements" ADD CONSTRAINT "addon_entitlements_addon_id_addons_id_fk" FOREIGN KEY ("addon_id") REFERENCES "revstack"."addons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."addon_entitlements" ADD CONSTRAINT "addon_entitlements_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "revstack"."entitlements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."addons" ADD CONSTRAINT "addons_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ADD CONSTRAINT "coupons_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."entitlements" ADD CONSTRAINT "entitlements_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."plan_entitlements" ADD CONSTRAINT "plan_entitlements_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."plan_entitlements" ADD CONSTRAINT "plan_entitlements_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "revstack"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."plan_entitlements" ADD CONSTRAINT "plan_entitlements_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "revstack"."entitlements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."plans" ADD CONSTRAINT "plans_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD CONSTRAINT "prices_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD CONSTRAINT "prices_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "revstack"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."customers" ADD CONSTRAINT "customers_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."users" ADD CONSTRAINT "users_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscription_addons" ADD CONSTRAINT "subscription_addons_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "revstack"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscription_addons" ADD CONSTRAINT "subscription_addons_addon_id_addons_id_fk" FOREIGN KEY ("addon_id") REFERENCES "revstack"."addons"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscription_coupons" ADD CONSTRAINT "subscription_coupons_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "revstack"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscription_coupons" ADD CONSTRAINT "subscription_coupons_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "revstack"."coupons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "revstack"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_price_id_prices_id_fk" FOREIGN KEY ("price_id") REFERENCES "revstack"."prices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."usages" ADD CONSTRAINT "usages_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."usages" ADD CONSTRAINT "usages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."usages" ADD CONSTRAINT "usages_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "revstack"."entitlements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "revstack"."wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."wallets" ADD CONSTRAINT "wallets_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."wallets" ADD CONSTRAINT "wallets_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "revstack"."entitlements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."credit_notes" ADD CONSTRAINT "credit_notes_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."credit_notes" ADD CONSTRAINT "credit_notes_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "revstack"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."credit_notes" ADD CONSTRAINT "credit_notes_refund_id_refunds_id_fk" FOREIGN KEY ("refund_id") REFERENCES "revstack"."refunds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoice_line_items" ADD CONSTRAINT "invoice_line_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "revstack"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoice_line_items" ADD CONSTRAINT "invoice_line_items_price_id_prices_id_fk" FOREIGN KEY ("price_id") REFERENCES "revstack"."prices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoice_line_items" ADD CONSTRAINT "invoice_line_items_addon_id_addons_id_fk" FOREIGN KEY ("addon_id") REFERENCES "revstack"."addons"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD CONSTRAINT "invoices_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD CONSTRAINT "invoices_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "revstack"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."payments" ADD CONSTRAINT "payments_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "revstack"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."payments" ADD CONSTRAINT "payments_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "revstack"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."provider_events" ADD CONSTRAINT "provider_events_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."refunds" ADD CONSTRAINT "refunds_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."refunds" ADD CONSTRAINT "refunds_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "revstack"."payments"("id") ON DELETE cascade ON UPDATE no action;