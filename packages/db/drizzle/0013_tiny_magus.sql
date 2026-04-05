CREATE TYPE "revstack"."integration_mode" AS ENUM('sandbox', 'production');--> statement-breakpoint
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
ALTER TABLE "revstack"."integrations" ADD COLUMN "mode" "revstack"."integration_mode" NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."provider_mappings" ADD CONSTRAINT "provider_mappings_environment_id_environments_id_fk" FOREIGN KEY ("environment_id") REFERENCES "revstack"."environments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pvm_bundle_hash_idx" ON "revstack"."provider_mappings" USING btree ("bundle_hash");--> statement-breakpoint
CREATE INDEX "pvm_lookup_idx" ON "revstack"."provider_mappings" USING btree ("environment_id","provider","bundle_hash");