import {
  text,
  timestamp,
  boolean,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId, STATUSES } from "@revstackhq/core";

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
import { workspaceMembers } from "@/schema/workspaces";
import { billingPolicies } from "@/schema/billing_policies";

export const apiKeyTypeEnum = revstack.enum("api_key_type", [
  "secret",
  "public",
]);

export const identityProviderVendorEnum = revstack.enum(
  "identity_provider_vendor",
  [
    "auth0",
    "clerk",
    "supabase",
    "cognito",
    "firebase",
    "kinde",
    "workos",
    "keycloak",
    "oidc",
    "custom",
  ],
);

export const signingStrategyEnum = revstack.enum("signing_strategy", [
  "RS256",
  "HS256",
]);

export const identityProviderStatusEnum = revstack.enum(
  "identity_provider_status",
  STATUSES,
);

/**
 * Represents an isolated environment (e.g., 'Production', 'Development').
 * Essential for multi-tenant setups and isolating data across deployment stages.
 */
export const environments = revstack.table(
  "environments",
  {
    id: text("id")
      .$defaultFn(() => generateId("env"))
      .primaryKey(),
    projectId: text("project_id").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("env_project_slug_idx").on(t.projectId, t.slug)],
);

export const apiKeys = revstack.table(
  "api_keys",
  {
    id: text("id")
      .$defaultFn(() => generateId("ak"))
      .primaryKey(),

    keyHash: text("key_hash").notNull().unique(),

    displayKey: text("display_key").notNull(),

    name: text("name").notNull(),

    scopes: jsonb("scopes").$type<string[]>().default([]).notNull(),

    environmentId: text("environment_id")
      .references(() => environments.id, { onDelete: "cascade" })
      .notNull(),

    type: apiKeyTypeEnum("type").notNull(),

    status: text("status", { enum: ["active", "revoked", "expired"] })
      .default("active")
      .notNull(),

    expiresAt: timestamp("expires_at", { withTimezone: true }),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("ak_env_idx").on(t.environmentId)],
);
/**
 * Stores the external Authentication Provider configuration (JWKS or Signing Secret)
 * used to verify JIT users via headers on incoming requests.
 */
export const identityProviders = revstack.table(
  "identity_providers",
  {
    id: text("id")
      .$defaultFn(() => generateId("auth"))
      .primaryKey(),
    environmentId: text("environment_id")
      .references(() => environments.id, { onDelete: "cascade" })
      .notNull(),
    vendor: identityProviderVendorEnum("vendor").notNull(),
    strategy: signingStrategyEnum("strategy").notNull(),

    jwksUri: text("jwks_uri"),

    signingSecret: text("signing_secret"),

    issuer: text("issuer"),
    audience: text("audience"),

    userIdClaim: text("user_id_claim").default("sub").notNull(),
    emailClaim: text("email_claim").default("email"),

    status: identityProviderStatusEnum("status").notNull().default("active"),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("idp_env_vendor_idx").on(t.environmentId, t.vendor)],
);

export const environmentsRelations = relations(environments, ({ many }) => ({
  apiKeys: many(apiKeys),
  integrations: many(integrations),
  identityProviders: many(identityProviders),
  users: many(users),
  workspaceMembers: many(workspaceMembers),
  customers: many(customers),
  plans: many(plans),
  entitlements: many(entitlements),
  billingPolicies: many(billingPolicies),
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

export const identityProvidersRelations = relations(
  identityProviders,
  ({ one }) => ({
    environment: one(environments, {
      fields: [identityProviders.environmentId],
      references: [environments.id],
    }),
  }),
);
