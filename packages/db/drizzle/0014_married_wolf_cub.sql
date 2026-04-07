CREATE TYPE "revstack"."credit_note_reason" AS ENUM('duplicate', 'fraudulent', 'order_change', 'product_unsatisfactory', 'other');--> statement-breakpoint
CREATE TYPE "revstack"."discount_status" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TYPE "revstack"."dispute_status" AS ENUM('needs_response', 'under_review', 'won', 'lost', 'warning');--> statement-breakpoint
CREATE TYPE "revstack"."entitlement_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "revstack"."payment_method_status" AS ENUM('active', 'expired', 'failed');--> statement-breakpoint
CREATE TYPE "revstack"."workspace_role" AS ENUM('owner', 'admin', 'viewer');--> statement-breakpoint
CREATE TABLE "revstack"."payment_methods" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"provider_payment_method_id" text NOT NULL,
	"type" text NOT NULL,
	"brand" text,
	"last4" varchar(4),
	"exp_month" integer,
	"exp_year" integer,
	"is_default" boolean DEFAULT false NOT NULL,
	"status" "revstack"."payment_method_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
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
	CONSTRAINT "disputes_external_id_unique" UNIQUE("external_id")
);
--> statement-breakpoint
ALTER TABLE "revstack"."entitlements" RENAME COLUMN "is_active" TO "status";--> statement-breakpoint
ALTER TABLE "revstack"."workspace_members" RENAME COLUMN "is_superadmin" TO "role";--> statement-breakpoint
ALTER TABLE "revstack"."prices" ALTER COLUMN "billing_interval" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "revstack"."addons" ALTER COLUMN "billing_interval" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "revstack"."billing_interval";--> statement-breakpoint
CREATE TYPE "revstack"."billing_interval" AS ENUM('day', 'week', 'month', 'year');--> statement-breakpoint
ALTER TABLE "revstack"."prices" ALTER COLUMN "billing_interval" SET DATA TYPE "revstack"."billing_interval" USING "billing_interval"::"revstack"."billing_interval";--> statement-breakpoint
ALTER TABLE "revstack"."addons" ALTER COLUMN "billing_interval" SET DATA TYPE "revstack"."billing_interval" USING "billing_interval"::"revstack"."billing_interval";--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "revstack"."discount_type";--> statement-breakpoint
CREATE TYPE "revstack"."discount_type" AS ENUM('percentage', 'fixed_amount');--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ALTER COLUMN "type" SET DATA TYPE "revstack"."discount_type" USING "type"::"revstack"."discount_type";--> statement-breakpoint
ALTER TABLE "revstack"."entitlements" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "revstack"."entitlement_type";--> statement-breakpoint
CREATE TYPE "revstack"."entitlement_type" AS ENUM('boolean', 'static', 'metered', 'json');--> statement-breakpoint
ALTER TABLE "revstack"."entitlements" ALTER COLUMN "type" SET DATA TYPE "revstack"."entitlement_type" USING "type"::"revstack"."entitlement_type";--> statement-breakpoint
ALTER TABLE "revstack"."customers" ALTER COLUMN "metadata" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ALTER COLUMN "status" SET DATA TYPE "revstack"."discount_status" USING "status"::text::"revstack"."discount_status";--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "revstack"."customers" ADD COLUMN "currency" text DEFAULT 'USD' NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."customers" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."customers" ADD COLUMN "billing_address" jsonb;--> statement-breakpoint
ALTER TABLE "revstack"."customers" ADD COLUMN "tax_ids" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "revstack"."customers" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD COLUMN "pending_plan_id" text;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD COLUMN "pending_price_id" text;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD COLUMN "schedule_change_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "revstack"."addon_entitlements" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."addons" ADD COLUMN "billing_interval_count" integer;--> statement-breakpoint
ALTER TABLE "revstack"."addons" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "revstack"."addons" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ADD COLUMN "currency" text;--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ADD COLUMN "redemptions_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ADD COLUMN "restricted_plan_ids" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ADD COLUMN "is_first_time_only" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."workspace_members" ADD COLUMN "environment_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD COLUMN "amount_refunded" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."refunds" ADD COLUMN "failure_code" text;--> statement-breakpoint
ALTER TABLE "revstack"."refunds" ADD COLUMN "failure_message" text;--> statement-breakpoint
ALTER TABLE "revstack"."credit_notes" ADD COLUMN "reason_code" "revstack"."credit_note_reason" DEFAULT 'other';--> statement-breakpoint
ALTER TABLE "revstack"."payment_methods" ADD CONSTRAINT "payment_methods_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."payment_methods" ADD CONSTRAINT "payment_methods_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "revstack"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."disputes" ADD CONSTRAINT "disputes_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."disputes" ADD CONSTRAINT "disputes_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "revstack"."payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_pending_plan_id_plans_id_fk" FOREIGN KEY ("pending_plan_id") REFERENCES "revstack"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_pending_price_id_prices_id_fk" FOREIGN KEY ("pending_price_id") REFERENCES "revstack"."prices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."workspace_members" ADD CONSTRAINT "workspace_members_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."addon_entitlements" ADD CONSTRAINT "unq_addon_entitlement_idx" UNIQUE("addon_id","entitlement_id");--> statement-breakpoint
ALTER TABLE "revstack"."addons" ADD CONSTRAINT "unq_addon_slug_env_idx" UNIQUE("environment_id","slug");