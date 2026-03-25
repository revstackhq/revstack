import { text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@/utils/id";
import { authProviderEnum, signingStrategyEnum, statusEnum } from "@/schema/enums";

import { users } from "@/schema/users";
import { customers } from "@/schema/customers";
import { plans } from "@/schema/plans";
import { entitlements } from "@/schema/entitlements";
import { providerEvents } from "@/schema/events";
import { payments } from "@/schema/payments";
import { refunds } from "@/schema/refunds";
import { creditNotes } from "@/schema/credit_notes";
import { usageMeters } from "@/schema/usages";
import { auditLogs } from "@/schema/logs";
import { webhookEndpoints } from "@/schema/webhooks";
import { integrations } from "@/schema/integrations";

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
  name: text("name").notNull(),
  scopes: jsonb("scopes").default([]).notNull(),
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

  status: statusEnum("status").notNull().default("active"),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const environmentsRelations = relations(environments, ({ many }) => ({
  apiKeys: many(apiKeys),
  integrations: many(integrations),
  authConfigs: many(authConfigs),
  users: many(users),
  customers: many(customers),
  plans: many(plans),
  entitlements: many(entitlements),
  providerEvents: many(providerEvents),
  payments: many(payments),
  refunds: many(refunds),
  creditNotes: many(creditNotes),
  usageMeters: many(usageMeters),
  auditLogs: many(auditLogs),
  webhookEndpoints: many(webhookEndpoints),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  environment: one(environments, {
    fields: [apiKeys.environmentId],
    references: [environments.id],
  }),
}));

export const authConfigsRelations = relations(authConfigs, ({ one }) => ({
  environment: one(environments, {
    fields: [authConfigs.environmentId],
    references: [environments.id],
  }),
}));
