CREATE TYPE "revstack"."billing_scheme" AS ENUM('flat', 'per_unit', 'tiered_volume', 'tiered_graduated', 'metered', 'custom', 'free');--> statement-breakpoint
CREATE TYPE "revstack"."event_type" AS ENUM('PAYMENT_CREATED', 'PAYMENT_AUTHORIZED', 'PAYMENT_CAPTURED', 'PAYMENT_PROCESSING', 'PAYMENT_SUCCEEDED', 'PAYMENT_FAILED', 'PAYMENT_CANCELED', 'REFUND_CREATED', 'REFUND_PROCESSED', 'REFUND_FAILED', 'DISPUTE_CREATED', 'DISPUTE_UPDATED', 'DISPUTE_WON', 'DISPUTE_LOST', 'CHECKOUT_CREATED', 'CHECKOUT_COMPLETED', 'CHECKOUT_EXPIRED', 'CHECKOUT_CANCELED', 'SUBSCRIPTION_CREATED', 'SUBSCRIPTION_UPDATED', 'SUBSCRIPTION_RENEWED', 'SUBSCRIPTION_PAST_DUE', 'SUBSCRIPTION_CANCELED', 'SUBSCRIPTION_REVOKED', 'SUBSCRIPTION_PAUSED', 'SUBSCRIPTION_RESUMED', 'SUBSCRIPTION_TRIAL_WILL_END', 'INVOICE_CREATED', 'INVOICE_FINALIZED', 'INVOICE_PAID', 'INVOICE_PAYMENT_FAILED', 'INVOICE_VOIDED', 'INVOICE_UNCOLLECTIBLE', 'CUSTOMER_CREATED', 'CUSTOMER_UPDATED', 'CUSTOMER_DELETED', 'PAYMENT_METHOD_ATTACHED', 'PAYMENT_METHOD_UPDATED', 'PAYMENT_METHOD_DETACHED', 'MANDATE_CREATED', 'MANDATE_REVOKED', 'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED', 'PRICE_CREATED', 'PRICE_UPDATED', 'PRICE_DELETED');--> statement-breakpoint
CREATE TYPE "revstack"."invoice_status" AS ENUM('draft', 'open', 'paid', 'uncollectible', 'void');--> statement-breakpoint
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
ALTER TABLE "revstack"."subscriptions" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "revstack"."subscription_status";--> statement-breakpoint
CREATE TYPE "revstack"."subscription_status" AS ENUM('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'paused', 'unpaid', 'revoked', 'canceled');--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ALTER COLUMN "status" SET DATA TYPE "revstack"."subscription_status" USING "status"::"revstack"."subscription_status";--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ALTER COLUMN "status" SET DATA TYPE "revstack"."invoice_status" USING "status"::"revstack"."invoice_status";--> statement-breakpoint
ALTER TABLE "revstack"."integrations" ADD COLUMN "config" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD COLUMN "billing_reason" text;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD COLUMN "billing_scheme" "revstack"."billing_scheme" DEFAULT 'flat' NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD COLUMN "tiers" jsonb;--> statement-breakpoint
ALTER TABLE "revstack"."customers" ADD CONSTRAINT "customers_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."provider_events" ADD CONSTRAINT "provider_events_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."integrations" DROP COLUMN "credentials";--> statement-breakpoint
ALTER TABLE "revstack"."integrations" DROP COLUMN "webhook_secret";--> statement-breakpoint
ALTER TABLE "revstack"."users" DROP COLUMN "gateway_customer_id";