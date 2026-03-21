CREATE TYPE "revstack"."usage_action" AS ENUM('increment', 'decrement', 'set');--> statement-breakpoint
ALTER TYPE "revstack"."invoice_line_item_type" ADD VALUE 'one_time_charge' BEFORE 'overage';--> statement-breakpoint
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
CREATE TABLE "revstack"."studio_admins" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text,
	"is_superadmin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "studio_admins_email_unique" UNIQUE("email")
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
ALTER TABLE "revstack"."wallet_transactions" ALTER COLUMN "amount" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "revstack"."wallets" ALTER COLUMN "balance" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "revstack"."usages" ADD COLUMN "action" "revstack"."usage_action" DEFAULT 'increment' NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."usage_meters" ADD CONSTRAINT "usage_meters_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."usage_meters" ADD CONSTRAINT "usage_meters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."usage_meters" ADD CONSTRAINT "usage_meters_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "revstack"."entitlements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."audit_logs" ADD CONSTRAINT "audit_logs_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."audit_logs" ADD CONSTRAINT "audit_logs_actor_id_studio_admins_id_fk" FOREIGN KEY ("actor_id") REFERENCES "revstack"."studio_admins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_endpoint_id_webhook_endpoints_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "revstack"."webhook_endpoints"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;