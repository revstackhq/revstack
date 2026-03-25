CREATE TYPE "revstack"."status" AS ENUM('active', 'inactive', 'archived', 'draft');--> statement-breakpoint
ALTER TABLE "revstack"."auth_configs" RENAME COLUMN "is_active" TO "status";--> statement-breakpoint
ALTER TABLE "revstack"."integrations" RENAME COLUMN "is_active" TO "status";--> statement-breakpoint
ALTER TABLE "revstack"."prices" RENAME COLUMN "is_active" TO "status";--> statement-breakpoint
ALTER TABLE "revstack"."addons" RENAME COLUMN "is_active" TO "status";--> statement-breakpoint
ALTER TABLE "revstack"."plans" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "revstack"."plans" ALTER COLUMN "status" SET DATA TYPE "revstack"."status" USING "status"::text::"revstack"."status";--> statement-breakpoint
ALTER TABLE "revstack"."plans" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "revstack"."api_keys" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."api_keys" ADD COLUMN "scopes" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD COLUMN "idempotency_key" text;--> statement-breakpoint
ALTER TABLE "revstack"."payments" ADD COLUMN "idempotency_key" text;--> statement-breakpoint
ALTER TABLE "revstack"."refunds" ADD COLUMN "idempotency_key" text;--> statement-breakpoint
ALTER TABLE "revstack"."coupons" ADD COLUMN "status" "revstack"."status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."plans" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD CONSTRAINT "invoices_idempotency_key_unique" UNIQUE("idempotency_key");--> statement-breakpoint
ALTER TABLE "revstack"."payments" ADD CONSTRAINT "payments_idempotency_key_unique" UNIQUE("idempotency_key");--> statement-breakpoint
ALTER TABLE "revstack"."refunds" ADD CONSTRAINT "refunds_idempotency_key_unique" UNIQUE("idempotency_key");--> statement-breakpoint
DROP TYPE "revstack"."plan_status";