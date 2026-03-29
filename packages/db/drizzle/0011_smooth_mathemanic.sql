CREATE TYPE "revstack"."api_key_type" AS ENUM('secret', 'public');--> statement-breakpoint
ALTER TABLE "revstack"."api_keys" ALTER COLUMN "type" SET DATA TYPE "revstack"."api_key_type" USING "type"::"revstack"."api_key_type";--> statement-breakpoint
ALTER TABLE "revstack"."environments" ADD COLUMN "is_default" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "revstack"."environments" ADD COLUMN "slug" text NOT NULL;