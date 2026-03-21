CREATE TYPE "revstack"."auth_provider" AS ENUM('auth0', 'clerk', 'supabase', 'cognito', 'firebase', 'custom');--> statement-breakpoint
CREATE TYPE "revstack"."credit_note_status" AS ENUM('issued', 'void');--> statement-breakpoint
CREATE TYPE "revstack"."payment_status" AS ENUM('pending', 'requires_action', 'processing', 'authorized', 'succeeded', 'failed', 'canceled', 'refunded', 'partially_refunded', 'disputed');--> statement-breakpoint
CREATE TYPE "revstack"."pricing_type" AS ENUM('recurring', 'one_time');--> statement-breakpoint
CREATE TYPE "revstack"."refund_status" AS ENUM('pending', 'succeeded', 'failed', 'canceled');--> statement-breakpoint
CREATE TYPE "revstack"."signing_strategy" AS ENUM('RS256', 'HS256');--> statement-breakpoint
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
ALTER TABLE "revstack"."addons" ALTER COLUMN "amount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ALTER COLUMN "value" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ALTER COLUMN "amount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ALTER COLUMN "amount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "revstack"."addons" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."entitlements" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD COLUMN "subtotal" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD COLUMN "discount" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD COLUMN "tax" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD COLUMN "amount_due" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD COLUMN "amount_paid" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD COLUMN "amount_remaining" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."plans" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD COLUMN "type" "revstack"."pricing_type" DEFAULT 'recurring' NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD COLUMN "interval_count" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD COLUMN "minimum_amount" integer;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD COLUMN "unit_label" text;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."auth_configs" ADD CONSTRAINT "auth_configs_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."credit_notes" ADD CONSTRAINT "credit_notes_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."credit_notes" ADD CONSTRAINT "credit_notes_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "revstack"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."credit_notes" ADD CONSTRAINT "credit_notes_refund_id_refunds_id_fk" FOREIGN KEY ("refund_id") REFERENCES "revstack"."refunds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."payments" ADD CONSTRAINT "payments_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "revstack"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."payments" ADD CONSTRAINT "payments_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "revstack"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."refunds" ADD CONSTRAINT "refunds_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."refunds" ADD CONSTRAINT "refunds_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "revstack"."payments"("id") ON DELETE cascade ON UPDATE no action;