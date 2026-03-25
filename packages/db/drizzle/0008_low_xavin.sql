CREATE TYPE "revstack"."processing_status" AS ENUM('idle', 'processing', 'failed');--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD COLUMN "next_billing_job_id" text;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD COLUMN "processing_status" "revstack"."processing_status" DEFAULT 'idle' NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD COLUMN "next_retry_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD COLUMN "dunning_step" integer DEFAULT 0 NOT NULL;