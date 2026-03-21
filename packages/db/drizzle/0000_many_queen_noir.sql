CREATE SCHEMA "revstack";
--> statement-breakpoint
CREATE TABLE "revstack"."api_keys" (
	"key" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."entitlements" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"unit_type" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."environments" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"subscription_id" text,
	"amount" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" text NOT NULL,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."plan_entitlements" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"entitlement_id" text NOT NULL,
	"value_limit" integer,
	"value_bool" boolean,
	"is_hard_limit" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."plans" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'active' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."prices" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"billing_interval" text NOT NULL,
	"trial_period_days" integer DEFAULT 0 NOT NULL,
	"overage_config" jsonb
);
--> statement-breakpoint
CREATE TABLE "revstack"."subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"price_id" text,
	"status" text NOT NULL,
	"current_period_start" timestamp with time zone NOT NULL,
	"current_period_end" timestamp with time zone NOT NULL,
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
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revstack"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"environment_id" text NOT NULL,
	"external_id" text NOT NULL,
	"email" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"gateway_customer_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "revstack"."api_keys" ADD CONSTRAINT "api_keys_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."entitlements" ADD CONSTRAINT "entitlements_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD CONSTRAINT "invoices_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."invoices" ADD CONSTRAINT "invoices_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "revstack"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."plan_entitlements" ADD CONSTRAINT "plan_entitlements_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."plan_entitlements" ADD CONSTRAINT "plan_entitlements_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "revstack"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."plan_entitlements" ADD CONSTRAINT "plan_entitlements_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "revstack"."entitlements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."plans" ADD CONSTRAINT "plans_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD CONSTRAINT "prices_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."prices" ADD CONSTRAINT "prices_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "revstack"."plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "revstack"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."subscriptions" ADD CONSTRAINT "subscriptions_price_id_prices_id_fk" FOREIGN KEY ("price_id") REFERENCES "revstack"."prices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."usages" ADD CONSTRAINT "usages_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."usages" ADD CONSTRAINT "usages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "revstack"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."usages" ADD CONSTRAINT "usages_entitlement_id_entitlements_id_fk" FOREIGN KEY ("entitlement_id") REFERENCES "revstack"."entitlements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revstack"."users" ADD CONSTRAINT "users_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;