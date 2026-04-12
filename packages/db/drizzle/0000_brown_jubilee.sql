CREATE SCHEMA "revstack";
--> statement-breakpoint
CREATE TYPE "revstack"."billing_interval" AS ENUM('day', 'week', 'month', 'year');--> statement-breakpoint
CREATE TYPE "revstack"."api_key_type" AS ENUM('secret', 'public');--> statement-breakpoint
CREATE TYPE "revstack"."identity_provider_status" AS ENUM('active', 'inactive', 'archived', 'draft');--> statement-breakpoint
CREATE TYPE "revstack"."identity_provider_vendor" AS ENUM('auth0', 'clerk', 'supabase', 'cognito', 'firebase', 'kinde', 'workos', 'keycloak', 'oidc', 'custom');--> statement-breakpoint
CREATE TYPE "revstack"."signing_strategy" AS ENUM('RS256', 'HS256');--> statement-breakpoint
CREATE TYPE "revstack"."processing_status" AS ENUM('idle', 'processing', 'failed');--> statement-breakpoint
CREATE TYPE "revstack"."subscription_status" AS ENUM('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'paused', 'unpaid', 'revoked', 'canceled');--> statement-breakpoint
CREATE TYPE "revstack"."wallet_tx_type" AS ENUM('credit', 'debit');--> statement-breakpoint
CREATE TYPE "revstack"."plan_status" AS ENUM('active', 'inactive', 'archived', 'draft');--> statement-breakpoint
CREATE TYPE "revstack"."plan_type" AS ENUM('paid', 'free', 'custom');--> statement-breakpoint
CREATE TYPE "revstack"."reset_period" AS ENUM('daily', 'weekly', 'monthly', 'yearly', 'never');--> statement-breakpoint
CREATE TYPE "revstack"."billing_scheme" AS ENUM('flat', 'per_unit', 'tiered_volume', 'tiered_graduated', 'metered', 'custom', 'free');--> statement-breakpoint
CREATE TYPE "revstack"."price_status" AS ENUM('active', 'inactive', 'archived', 'draft');--> statement-breakpoint
CREATE TYPE "revstack"."pricing_type" AS ENUM('recurring', 'one_time');--> statement-breakpoint
CREATE TYPE "revstack"."addon_entitlement_type" AS ENUM('increment', 'set');--> statement-breakpoint
CREATE TYPE "revstack"."addon_status" AS ENUM('active', 'inactive', 'archived', 'draft');--> statement-breakpoint
CREATE TYPE "revstack"."addon_type" AS ENUM('recurring', 'one_time');--> statement-breakpoint
CREATE TYPE "revstack"."discount_duration" AS ENUM('once', 'forever', 'repeating');--> statement-breakpoint
CREATE TYPE "revstack"."discount_status" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TYPE "revstack"."discount_type" AS ENUM('percentage', 'fixed_amount');--> statement-breakpoint
CREATE TYPE "revstack"."entitlement_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "revstack"."entitlement_type" AS ENUM('boolean', 'static', 'metered', 'json');--> statement-breakpoint
CREATE TYPE "revstack"."unit_type" AS ENUM('count', 'bytes', 'seconds', 'tokens', 'requests', 'custom');--> statement-breakpoint
CREATE TYPE "revstack"."usage_action" AS ENUM('increment', 'decrement', 'set');--> statement-breakpoint
CREATE TYPE "revstack"."workspace_role" AS ENUM('owner', 'admin', 'viewer');--> statement-breakpoint
CREATE TYPE "revstack"."invoice_line_item_type" AS ENUM('subscription', 'one_time_charge', 'overage', 'addon', 'setup_fee', 'proration');--> statement-breakpoint
CREATE TYPE "revstack"."invoice_status" AS ENUM('draft', 'open', 'paid', 'uncollectible', 'void');--> statement-breakpoint
CREATE TYPE "revstack"."payment_status" AS ENUM('pending', 'requires_action', 'processing', 'authorized', 'succeeded', 'failed', 'canceled', 'refunded', 'partially_refunded', 'disputed');--> statement-breakpoint
CREATE TYPE "revstack"."refund_status" AS ENUM('pending', 'succeeded', 'failed', 'canceled');--> statement-breakpoint
CREATE TYPE "revstack"."credit_note_reason" AS ENUM('duplicate', 'fraudulent', 'order_change', 'product_unsatisfactory', 'other');--> statement-breakpoint
CREATE TYPE "revstack"."credit_note_status" AS ENUM('issued', 'void');--> statement-breakpoint
CREATE TYPE "revstack"."provider_event_status" AS ENUM('pending', 'processed', 'failed');--> statement-breakpoint
CREATE TYPE "revstack"."provider_event_type" AS ENUM('PAYMENT_CREATED', 'PAYMENT_AUTHORIZED', 'PAYMENT_CAPTURED', 'PAYMENT_PROCESSING', 'PAYMENT_SUCCEEDED', 'PAYMENT_FAILED', 'PAYMENT_CANCELED', 'REFUND_CREATED', 'REFUND_PROCESSED', 'REFUND_FAILED', 'DISPUTE_CREATED', 'DISPUTE_UPDATED', 'DISPUTE_WON', 'DISPUTE_LOST', 'CHECKOUT_CREATED', 'CHECKOUT_COMPLETED', 'CHECKOUT_EXPIRED', 'CHECKOUT_CANCELED', 'SUBSCRIPTION_CREATED', 'SUBSCRIPTION_UPDATED', 'SUBSCRIPTION_RENEWED', 'SUBSCRIPTION_PAST_DUE', 'SUBSCRIPTION_CANCELED', 'SUBSCRIPTION_REVOKED', 'SUBSCRIPTION_PAUSED', 'SUBSCRIPTION_RESUMED', 'SUBSCRIPTION_TRIAL_WILL_END', 'INVOICE_CREATED', 'INVOICE_FINALIZED', 'INVOICE_PAID', 'INVOICE_PAYMENT_FAILED', 'INVOICE_VOIDED', 'INVOICE_UNCOLLECTIBLE', 'CUSTOMER_CREATED', 'CUSTOMER_UPDATED', 'CUSTOMER_DELETED', 'PAYMENT_METHOD_ATTACHED', 'PAYMENT_METHOD_UPDATED', 'PAYMENT_METHOD_DETACHED', 'MANDATE_CREATED', 'MANDATE_REVOKED', 'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED', 'PRICE_CREATED', 'PRICE_UPDATED', 'PRICE_DELETED');--> statement-breakpoint
CREATE TYPE "revstack"."integration_mode" AS ENUM('sandbox', 'production');--> statement-breakpoint
CREATE TYPE "revstack"."integration_status" AS ENUM('active', 'inactive', 'archived', 'draft');--> statement-breakpoint
CREATE TYPE "revstack"."payment_method_status" AS ENUM('active', 'expired', 'failed');--> statement-breakpoint
CREATE TYPE "revstack"."dispute_status" AS ENUM('needs_response', 'under_review', 'won', 'lost', 'warning');--> statement-breakpoint
CREATE TABLE "revstack"."api_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"key_hash" text NOT NULL,
	"display_key" text NOT NULL,
	"name" text NOT NULL,
	"scopes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"environment_id" text NOT NULL,
	"type" "revstack"."api_key_type" NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"expires_at" timestamp with time zone,
	"last_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE TABLE "revstack"."environments" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."identity_providers" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"vendor" "revstack"."identity_provider_vendor" NOT NULL,
	"strategy" "revstack"."signing_strategy" NOT NULL,
	"jwks_uri" text,
	"signing_secret" text,
	"issuer" text,
	"audience" text,
	"user_id_claim" text DEFAULT 'sub' NOT NULL,
	"email_claim" text DEFAULT 'email',
	"status" "revstack"."identity_provider_status" DEFAULT 'active' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."billing_policies" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"grace_period_days" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 0 NOT NULL,
	"retry_intervals" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"dunning_strategy" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"cancel_on_failure" boolean DEFAULT false NOT NULL,
	"pause_on_failure" boolean DEFAULT false NOT NULL,
	"notify_on_failure" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"external_id" text,
	"is_guest" boolean DEFAULT false NOT NULL,
	"email" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."customers" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"provider_id" text,
	"external_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"country_code" text,
	"metadata" jsonb,
	"currency" text DEFAULT 'usd' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"billing_address" jsonb,
	"tax_ids" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."subscription_addons" (
	"id" text PRIMARY KEY NOT NULL,
	"subscription_id" text NOT NULL,
	"addon_id" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_amount" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."subscription_billing" (
	"subscription_id" text PRIMARY KEY NOT NULL,
	"currency" text NOT NULL,
	"external_subscription_id" text,
	"provider_metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."subscription_coupons" (
	"id" text PRIMARY KEY NOT NULL,
	"subscription_id" text NOT NULL,
	"coupon_id" text NOT NULL,
	"applied_at" timestamp with time zone DEFAULT now() NOT NULL,
	"benefit_ends_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "revstack"."subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"customer_id" text,
	"plan_id" text NOT NULL,
	"price_id" text,
	"status" "revstack"."subscription_status" NOT NULL,
	"current_period_start" timestamp with time zone NOT NULL,
	"current_period_end" timestamp with time zone NOT NULL,
	"billing_cycle_anchor" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"canceled_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"paused_at" timestamp with time zone,
	"trial_start" timestamp with time zone,
	"trial_end" timestamp with time zone,
	"external_subscription_id" text,
	"next_billing_job_id" text,
	"processing_status" "revstack"."processing_status" DEFAULT 'idle' NOT NULL,
	"pending_plan_id" text,
	"pending_price_id" text,
	"schedule_change_at" timestamp with time zone,
	"currency" text DEFAULT 'usd' NOT NULL,
	"provider_metadata" jsonb DEFAULT '{}'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."wallet_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"wallet_id" text NOT NULL,
	"amount" integer NOT NULL,
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
	"balance" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
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
	"status" "revstack"."price_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."addon_entitlements" (
	"id" text PRIMARY KEY NOT NULL,
	"addon_id" text NOT NULL,
	"entitlement_id" text NOT NULL,
	"value_limit" integer,
	"type" "revstack"."addon_entitlement_type" DEFAULT 'increment' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unq_addon_entitlement_idx" UNIQUE("addon_id","entitlement_id")
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
	"billing_interval_count" integer,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"metadata" jsonb,
	"status" "revstack"."addon_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unq_addon_slug_env_idx" UNIQUE("environment_id","slug")
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
	"currency" text,
	"redemptions_count" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"expires_at" timestamp with time zone,
	"status" "revstack"."discount_status" DEFAULT 'active' NOT NULL,
	"restricted_plan_ids" text[] DEFAULT '{}'::text[] NOT NULL,
	"is_first_time_only" boolean DEFAULT false NOT NULL
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
	"status" "revstack"."entitlement_status" DEFAULT 'active' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."usage_meters" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"entitlement_id" text NOT NULL,
	"current_usage" integer DEFAULT 0 NOT NULL,
	"last_event_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reset_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."usages" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"entitlement_id" text NOT NULL,
	"amount" integer DEFAULT 1 NOT NULL,
	"action" "revstack"."usage_action" DEFAULT 'increment' NOT NULL,
	"idempotency_key" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "revstack"."workspace_members" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text,
	"role" "revstack"."workspace_role" DEFAULT 'admin' NOT NULL,
	"environment_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_members_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "revstack"."webhook_deliveries" (
	"id" text PRIMARY KEY NOT NULL,
	"endpoint_id" text NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status_code" integer,
	"success" boolean NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."webhook_endpoints" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"url" text NOT NULL,
	"signing_secret" text NOT NULL,
	"description" text,
	"enabled_events" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
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
	"customer_id" text NOT NULL,
	"subscription_id" text,
	"amount" integer NOT NULL,
	"subtotal" integer DEFAULT 0 NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"tax" integer DEFAULT 0 NOT NULL,
	"amount_due" integer DEFAULT 0 NOT NULL,
	"amount_paid" integer DEFAULT 0 NOT NULL,
	"amount_remaining" integer DEFAULT 0 NOT NULL,
	"amount_refunded" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "revstack"."invoice_status" NOT NULL,
	"billing_reason" text,
	"idempotency_key" text,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"next_retry_at" timestamp with time zone,
	"dunning_step" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "invoices_idempotency_key_unique" UNIQUE("idempotency_key")
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
	"idempotency_key" text,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_idempotency_key_unique" UNIQUE("idempotency_key")
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
	"failure_code" text,
	"failure_message" text,
	"idempotency_key" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "refunds_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "revstack"."credit_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"invoice_id" text NOT NULL,
	"refund_id" text,
	"reason_code" "revstack"."credit_note_reason" DEFAULT 'other',
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "revstack"."credit_note_status" DEFAULT 'issued' NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."provider_events" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"external_event_id" text NOT NULL,
	"type" "revstack"."provider_event_type" NOT NULL,
	"resource_id" text NOT NULL,
	"customer_id" text,
	"status" "revstack"."provider_event_status" DEFAULT 'pending' NOT NULL,
	"payload" jsonb NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "revstack"."audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"actor_id" text,
	"action" text NOT NULL,
	"resource" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."integrations" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"provider" text NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "revstack"."integration_status" DEFAULT 'active' NOT NULL,
	"mode" "revstack"."integration_mode" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."provider_mappings" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"bundle_hash" text NOT NULL,
	"provider" text NOT NULL,
	"external_product_id" text NOT NULL,
	"external_price_id" text NOT NULL,
	"component_ids" jsonb NOT NULL,
	"type" text DEFAULT 'standalone',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pvm_unique_bundle_idx" UNIQUE("environment_id","provider","bundle_hash")
);
--> statement-breakpoint
CREATE TABLE "revstack"."payment_method_cards" (
	"id" text PRIMARY KEY NOT NULL,
	"payment_method_id" text NOT NULL,
	"brand" text,
	"last4" varchar(4),
	"exp_month" integer,
	"exp_year" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."payment_methods" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"provider_payment_method_id" text NOT NULL,
	"type" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"status" "revstack"."payment_method_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."disputes" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"payment_id" text NOT NULL,
	"amount_disputed" integer NOT NULL,
	"fee_amount" integer NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" "revstack"."dispute_status" DEFAULT 'needs_response' NOT NULL,
	"reason" text,
	"evidence_due_by" timestamp with time zone,
	"external_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "disputes_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
ALTER TABLE "revstack"."api_keys" ADD CONSTRAINT "api_keys_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."identity_providers" ADD CONSTRAINT "identity_providers_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."billing_policies" ADD CONSTRAINT "billing_policies_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."users" ADD CONSTRAINT "users_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."customers" ADD CONSTRAINT "customers_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscription_addons" ADD CONSTRAINT "subscription_addons_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "revstack"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscription_addons" ADD CONSTRAINT "subscription_addons_addon_id_addons_id_fk" FOREIGN KEY ("addon_id") REFERENCES "revstack"."addons"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscription_billing" ADD CONSTRAINT "subscription_billing_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "revstack"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscription_coupons" ADD CONSTRAINT "subscription_coupons_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "revstack"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscription_coupons" ADD CONSTRAINT "subscription_coupons_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "revstack"."coupons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "revstack"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "revstack"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_price_id_prices_id_fk" FOREIGN KEY ("price_id") REFERENCES "revstack"."prices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_pending_plan_id_plans_id_fk" FOREIGN KEY ("pending_plan_id") REFERENCES "revstack"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_pending_price_id_prices_id_fk" FOREIGN KEY ("pending_price_id") REFERENCES "revstack"."prices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "revstack"."wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."wallets" ADD CONSTRAINT "wallets_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."wallets" ADD CONSTRAINT "wallets_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "revstack"."entitlements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."plan_entitlements" ADD CONSTRAINT "plan_entitlements_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."plan_entitlements" ADD CONSTRAINT "plan_entitlements_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "revstack"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."plan_entitlements" ADD CONSTRAINT "plan_entitlements_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "revstack"."entitlements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."plans" ADD CONSTRAINT "plans_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD CONSTRAINT "prices_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD CONSTRAINT "prices_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "revstack"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."addon_entitlements" ADD CONSTRAINT "addon_entitlements_addon_id_addons_id_fk" FOREIGN KEY ("addon_id") REFERENCES "revstack"."addons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."addon_entitlements" ADD CONSTRAINT "addon_entitlements_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "revstack"."entitlements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."addons" ADD CONSTRAINT "addons_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ADD CONSTRAINT "coupons_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."entitlements" ADD CONSTRAINT "entitlements_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."usage_meters" ADD CONSTRAINT "usage_meters_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."usage_meters" ADD CONSTRAINT "usage_meters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."usage_meters" ADD CONSTRAINT "usage_meters_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "revstack"."entitlements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."usages" ADD CONSTRAINT "usages_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."usages" ADD CONSTRAINT "usages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."usages" ADD CONSTRAINT "usages_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "revstack"."entitlements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."workspace_members" ADD CONSTRAINT "workspace_members_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_endpoint_id_webhook_endpoints_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "revstack"."webhook_endpoints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoice_line_items" ADD CONSTRAINT "invoice_line_items_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "revstack"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoice_line_items" ADD CONSTRAINT "invoice_line_items_price_id_prices_id_fk" FOREIGN KEY ("price_id") REFERENCES "revstack"."prices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoice_line_items" ADD CONSTRAINT "invoice_line_items_addon_id_addons_id_fk" FOREIGN KEY ("addon_id") REFERENCES "revstack"."addons"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD CONSTRAINT "invoices_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD CONSTRAINT "invoices_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "revstack"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD CONSTRAINT "invoices_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "revstack"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."payments" ADD CONSTRAINT "payments_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "revstack"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."payments" ADD CONSTRAINT "payments_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "revstack"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."refunds" ADD CONSTRAINT "refunds_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."refunds" ADD CONSTRAINT "refunds_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "revstack"."payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."credit_notes" ADD CONSTRAINT "credit_notes_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."credit_notes" ADD CONSTRAINT "credit_notes_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "revstack"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."credit_notes" ADD CONSTRAINT "credit_notes_refund_id_refunds_id_fk" FOREIGN KEY ("refund_id") REFERENCES "revstack"."refunds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."provider_events" ADD CONSTRAINT "provider_events_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."audit_logs" ADD CONSTRAINT "audit_logs_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."audit_logs" ADD CONSTRAINT "audit_logs_actor_id_workspace_members_id_fk" FOREIGN KEY ("actor_id") REFERENCES "revstack"."workspace_members"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."integrations" ADD CONSTRAINT "integrations_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."provider_mappings" ADD CONSTRAINT "provider_mappings_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."payment_method_cards" ADD CONSTRAINT "payment_method_cards_payment_method_id_payment_methods_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "revstack"."payment_methods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."payment_methods" ADD CONSTRAINT "payment_methods_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."payment_methods" ADD CONSTRAINT "payment_methods_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "revstack"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."disputes" ADD CONSTRAINT "disputes_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."disputes" ADD CONSTRAINT "disputes_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "revstack"."payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ak_env_idx" ON "revstack"."api_keys" USING btree ("environment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "env_project_slug_idx" ON "revstack"."environments" USING btree ("project_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "idp_env_vendor_idx" ON "revstack"."identity_providers" USING btree ("environment_id","vendor");--> statement-breakpoint
CREATE UNIQUE INDEX "billing_policy_env_idx" ON "revstack"."billing_policies" USING btree ("environment_id");--> statement-breakpoint
CREATE INDEX "usr_env_idx" ON "revstack"."users" USING btree ("environment_id");--> statement-breakpoint
CREATE INDEX "usr_env_email_idx" ON "revstack"."users" USING btree ("environment_id","email");--> statement-breakpoint
CREATE INDEX "usr_env_external_idx" ON "revstack"."users" USING btree ("environment_id","external_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cus_external_env_idx" ON "revstack"."customers" USING btree ("external_id","environment_id");--> statement-breakpoint
CREATE INDEX "cus_provider_env_idx" ON "revstack"."customers" USING btree ("provider_id","environment_id");--> statement-breakpoint
CREATE INDEX "cus_email_env_idx" ON "revstack"."customers" USING btree ("email","environment_id");--> statement-breakpoint
CREATE INDEX "cus_user_idx" ON "revstack"."customers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cus_created_at_idx" ON "revstack"."customers" USING btree ("environment_id","created_at");--> statement-breakpoint
CREATE INDEX "sub_addon_subscription_idx" ON "revstack"."subscription_addons" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "sub_addon_addon_idx" ON "revstack"."subscription_addons" USING btree ("addon_id");--> statement-breakpoint
CREATE INDEX "sub_bill_external_idx" ON "revstack"."subscription_billing" USING btree ("external_subscription_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sub_coupon_unique_idx" ON "revstack"."subscription_coupons" USING btree ("subscription_id","coupon_id");--> statement-breakpoint
CREATE INDEX "sub_coupon_coupon_idx" ON "revstack"."subscription_coupons" USING btree ("coupon_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sub_external_idx" ON "revstack"."subscriptions" USING btree ("external_subscription_id","environment_id");--> statement-breakpoint
CREATE INDEX "sub_schedule_idx" ON "revstack"."subscriptions" USING btree ("environment_id","schedule_change_at");--> statement-breakpoint
CREATE INDEX "sub_customer_status_idx" ON "revstack"."subscriptions" USING btree ("customer_id","status");--> statement-breakpoint
CREATE INDEX "sub_user_env_status_idx" ON "revstack"."subscriptions" USING btree ("user_id","environment_id","status");--> statement-breakpoint
CREATE INDEX "sub_env_status_period_idx" ON "revstack"."subscriptions" USING btree ("environment_id","status","current_period_end");--> statement-breakpoint
CREATE INDEX "wallet_tx_wallet_idx" ON "revstack"."wallet_transactions" USING btree ("wallet_id");--> statement-breakpoint
CREATE UNIQUE INDEX "wallet_env_user_entitlement_idx" ON "revstack"."wallets" USING btree ("environment_id","user_id","entitlement_id");--> statement-breakpoint
CREATE UNIQUE INDEX "plan_env_slug_idx" ON "revstack"."plans" USING btree ("environment_id","slug");--> statement-breakpoint
CREATE INDEX "plan_env_status_idx" ON "revstack"."plans" USING btree ("environment_id","status");--> statement-breakpoint
CREATE INDEX "price_env_idx" ON "revstack"."prices" USING btree ("environment_id");--> statement-breakpoint
CREATE INDEX "price_plan_idx" ON "revstack"."prices" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "price_env_status_idx" ON "revstack"."prices" USING btree ("environment_id","status");--> statement-breakpoint
CREATE INDEX "addon_env_status_idx" ON "revstack"."addons" USING btree ("environment_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "coup_env_code_idx" ON "revstack"."coupons" USING btree ("environment_id","code");--> statement-breakpoint
CREATE INDEX "coup_env_status_idx" ON "revstack"."coupons" USING btree ("environment_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "ent_env_slug_idx" ON "revstack"."entitlements" USING btree ("environment_id","slug");--> statement-breakpoint
CREATE INDEX "ent_env_status_idx" ON "revstack"."entitlements" USING btree ("environment_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "usage_meter_unique_idx" ON "revstack"."usage_meters" USING btree ("environment_id","user_id","entitlement_id");--> statement-breakpoint
CREATE INDEX "usage_env_user_time_idx" ON "revstack"."usages" USING btree ("environment_id","user_id","timestamp");--> statement-breakpoint
CREATE INDEX "usage_entitlement_time_idx" ON "revstack"."usages" USING btree ("entitlement_id","timestamp");--> statement-breakpoint
CREATE INDEX "wm_env_idx" ON "revstack"."workspace_members" USING btree ("environment_id");--> statement-breakpoint
CREATE INDEX "whd_endpoint_idx" ON "revstack"."webhook_deliveries" USING btree ("endpoint_id");--> statement-breakpoint
CREATE INDEX "whd_endpoint_created_idx" ON "revstack"."webhook_deliveries" USING btree ("endpoint_id","created_at");--> statement-breakpoint
CREATE INDEX "wh_env_idx" ON "revstack"."webhook_endpoints" USING btree ("environment_id");--> statement-breakpoint
CREATE INDEX "wh_env_active_idx" ON "revstack"."webhook_endpoints" USING btree ("environment_id","is_active");--> statement-breakpoint
CREATE INDEX "ili_invoice_idx" ON "revstack"."invoice_line_items" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "inv_env_status_idx" ON "revstack"."invoices" USING btree ("environment_id","status");--> statement-breakpoint
CREATE INDEX "inv_customer_idx" ON "revstack"."invoices" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "inv_subscription_idx" ON "revstack"."invoices" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "pay_env_status_idx" ON "revstack"."payments" USING btree ("environment_id","status");--> statement-breakpoint
CREATE INDEX "pay_customer_idx" ON "revstack"."payments" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "pay_invoice_idx" ON "revstack"."payments" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "pay_external_idx" ON "revstack"."payments" USING btree ("external_id");--> statement-breakpoint
CREATE INDEX "ref_payment_idx" ON "revstack"."refunds" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "cn_env_idx" ON "revstack"."credit_notes" USING btree ("environment_id");--> statement-breakpoint
CREATE INDEX "cn_invoice_idx" ON "revstack"."credit_notes" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "cn_refund_idx" ON "revstack"."credit_notes" USING btree ("refund_id");--> statement-breakpoint
CREATE UNIQUE INDEX "pevt_env_external_idx" ON "revstack"."provider_events" USING btree ("environment_id","external_event_id");--> statement-breakpoint
CREATE INDEX "pevt_env_status_idx" ON "revstack"."provider_events" USING btree ("environment_id","status");--> statement-breakpoint
CREATE INDEX "alog_env_idx" ON "revstack"."audit_logs" USING btree ("environment_id");--> statement-breakpoint
CREATE INDEX "alog_env_created_idx" ON "revstack"."audit_logs" USING btree ("environment_id","created_at");--> statement-breakpoint
CREATE INDEX "int_env_idx" ON "revstack"."integrations" USING btree ("environment_id");--> statement-breakpoint
CREATE INDEX "int_env_status_idx" ON "revstack"."integrations" USING btree ("environment_id","status");--> statement-breakpoint
CREATE INDEX "pvm_bundle_hash_idx" ON "revstack"."provider_mappings" USING btree ("bundle_hash");--> statement-breakpoint
CREATE INDEX "pvm_lookup_idx" ON "revstack"."provider_mappings" USING btree ("environment_id","provider","bundle_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "pmc_payment_method_idx" ON "revstack"."payment_method_cards" USING btree ("payment_method_id");--> statement-breakpoint
CREATE INDEX "pmc_brand_idx" ON "revstack"."payment_method_cards" USING btree ("brand");--> statement-breakpoint
CREATE INDEX "pm_customer_idx" ON "revstack"."payment_methods" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "pm_env_idx" ON "revstack"."payment_methods" USING btree ("environment_id");--> statement-breakpoint
CREATE INDEX "disp_env_status_idx" ON "revstack"."disputes" USING btree ("environment_id","status");--> statement-breakpoint
CREATE INDEX "disp_payment_idx" ON "revstack"."disputes" USING btree ("payment_id");