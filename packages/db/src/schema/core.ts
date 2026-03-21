import { text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { revstack } from "@/schema/namespace";
import { generateId } from "@/utils/id";
import { authProviderEnum, signingStrategyEnum } from "@/schema/enums";

/**
 * Represents an isolated environment (e.g., 'Production', 'Development').
 * Essential for multi-tenant setups and isolating data across deployment stages.
 */
export const environments = revstack.table("environments", {
  id: text("id")
    .$defaultFn(() => generateId("env"))
    .primaryKey(),
  projectId: text("project_id"), // Null if self-hosted, populated if running in Revstack Cloud
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Represents API keys used for authenticating requests originating from different environments.
 */
export const apiKeys = revstack.table("api_keys", {
  key: text("key").primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(), // 'secret' | 'public'
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Stores the external Authentication Provider configuration (JWKS or Signing Secret)
 * used to verify JIT users via headers on incoming requests.
 */
export const authConfigs = revstack.table("auth_configs", {
  id: text("id")
    .$defaultFn(() => generateId("auth"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  provider: authProviderEnum("provider").notNull(),
  strategy: signingStrategyEnum("strategy").notNull(),

  // RS256
  jwksUri: text("jwks_uri"),

  // HS256
  signingSecret: text("signing_secret"),

  // Common
  issuer: text("issuer"),
  audience: text("audience"),
  userIdClaim: text("user_id_claim").default("sub").notNull(),

  isActive: boolean("is_active").default(true).notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Stores credentials for external gateways (e.g., Stripe, Polar).
 * Necessary for the Engine to validate webhooks and process external billing events.
 */
export const integrations = revstack.table("integrations", {
  id: text("id")
    .$defaultFn(() => generateId("int"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  provider: text("provider").notNull(), // 'stripe', 'polar', etc.
  config: jsonb("config").notNull().default({}),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
