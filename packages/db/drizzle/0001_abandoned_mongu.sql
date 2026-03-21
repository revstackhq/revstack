CREATE TYPE "revstack"."addon_entitlement_type" AS ENUM('increment', 'set');--> statement-breakpoint
CREATE TYPE "revstack"."addon_type" AS ENUM('recurring', 'one_time');--> statement-breakpoint
CREATE TYPE "revstack"."billing_interval" AS ENUM('monthly', 'quarterly', 'yearly', 'one_time');--> statement-breakpoint
CREATE TYPE "revstack"."discount_duration" AS ENUM('once', 'forever', 'repeating');--> statement-breakpoint
CREATE TYPE "revstack"."discount_type" AS ENUM('percent', 'amount');--> statement-breakpoint
CREATE TYPE "revstack"."entitlement_type" AS ENUM('boolean', 'metered', 'static', 'json');--> statement-breakpoint
CREATE TYPE "revstack"."plan_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "revstack"."plan_type" AS ENUM('paid', 'free', 'custom');--> statement-breakpoint
CREATE TYPE "revstack"."reset_period" AS ENUM('daily', 'weekly', 'monthly', 'yearly', 'never');--> statement-breakpoint
CREATE TYPE "revstack"."subscription_status" AS ENUM('active', 'trialing', 'past_due', 'canceled', 'paused');--> statement-breakpoint
CREATE TYPE "revstack"."unit_type" AS ENUM('count', 'bytes', 'seconds', 'tokens', 'requests', 'custom');--> statement-breakpoint
CREATE TYPE "revstack"."wallet_tx_type" AS ENUM('credit', 'debit');--> statement-breakpoint
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
	"amount" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."coupons" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"code" text NOT NULL,
	"name" text,
	"type" "revstack"."discount_type" NOT NULL,
	"value" numeric(12, 2) NOT NULL,
	"duration" "revstack"."discount_duration" NOT NULL,
	"duration_in_months" integer,
	"max_redemptions" integer,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "revstack"."integrations" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"provider" text NOT NULL,
	"credentials" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"webhook_secret" text,
	"is_active" boolean DEFAULT true NOT NULL,
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
ALTER TABLE "revstack"."entitlements" ALTER COLUMN "type" SET DATA TYPE "revstack"."entitlement_type" USING "type"::"revstack"."entitlement_type";--> statement-breakpoint
ALTER TABLE "revstack"."entitlements" ALTER COLUMN "unit_type" SET DATA TYPE "revstack"."unit_type" USING "unit_type"::"revstack"."unit_type";--> statement-breakpoint
ALTER TABLE "revstack"."plans" ALTER COLUMN "status" SET DEFAULT 'active'::"revstack"."plan_status";--> statement-breakpoint
ALTER TABLE "revstack"."plans" ALTER COLUMN "status" SET DATA TYPE "revstack"."plan_status" USING "status"::"revstack"."plan_status";--> statement-breakpoint
ALTER TABLE "revstack"."prices" ALTER COLUMN "billing_interval" SET DATA TYPE "revstack"."billing_interval" USING "billing_interval"::"revstack"."billing_interval";--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ALTER COLUMN "status" SET DATA TYPE "revstack"."subscription_status" USING "status"::"revstack"."subscription_status";--> statement-breakpoint
ALTER TABLE "revstack"."users" ALTER COLUMN "external_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."entitlements" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "revstack"."plan_entitlements" ADD COLUMN "meter_id" text;--> statement-breakpoint
ALTER TABLE "revstack"."plan_entitlements" ADD COLUMN "value_text" text;--> statement-breakpoint
ALTER TABLE "revstack"."plan_entitlements" ADD COLUMN "value_json" jsonb;--> statement-breakpoint
ALTER TABLE "revstack"."plan_entitlements" ADD COLUMN "reset_period" "revstack"."reset_period";--> statement-breakpoint
ALTER TABLE "revstack"."plans" ADD COLUMN "type" "revstack"."plan_type" DEFAULT 'paid' NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."plans" ADD COLUMN "is_public" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD COLUMN "cancel_at_period_end" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD COLUMN "canceled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD COLUMN "trial_start" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD COLUMN "trial_end" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "revstack"."users" ADD COLUMN "is_guest" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."addon_entitlements" ADD CONSTRAINT "addon_entitlements_addon_id_addons_id_fk" FOREIGN KEY ("addon_id") REFERENCES "revstack"."addons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."addon_entitlements" ADD CONSTRAINT "addon_entitlements_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "revstack"."entitlements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."addons" ADD CONSTRAINT "addons_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ADD CONSTRAINT "coupons_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."integrations" ADD CONSTRAINT "integrations_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscription_addons" ADD CONSTRAINT "subscription_addons_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "revstack"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscription_addons" ADD CONSTRAINT "subscription_addons_addon_id_addons_id_fk" FOREIGN KEY ("addon_id") REFERENCES "revstack"."addons"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "revstack"."wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."wallets" ADD CONSTRAINT "wallets_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."wallets" ADD CONSTRAINT "wallets_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "revstack"."entitlements"("id") ON DELETE cascade ON UPDATE no action;