import { text, timestamp, jsonb, index, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId, STATUSES } from "@revstackhq/core";
import { environments } from "@/schema/core";

export const integrationModeEnum = revstack.enum("integration_mode", [
  "sandbox",
  "production",
]);

export const integrationStatusEnum = revstack.enum(
  "integration_status",
  STATUSES,
);

export const integrations = revstack.table(
  "integrations",
  {
    id: text("id")
      .$defaultFn(() => generateId("int"))
      .primaryKey(),
    environmentId: text("environment_id")
      .references(() => environments.id, { onDelete: "cascade" })
      .notNull(),
    provider: text("provider").notNull(),
    config: jsonb("config").notNull().default({}),
    status: integrationStatusEnum("status").notNull().default("active"),
    mode: integrationModeEnum("mode").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("int_env_idx").on(t.environmentId),
    index("int_env_status_idx").on(t.environmentId, t.status),
  ],
);

export const integrationsRelations = relations(integrations, ({ one }) => ({
  environment: one(environments, {
    fields: [integrations.environmentId],
    references: [environments.id],
  }),
}));

export const providerMappings = revstack.table(
  "provider_mappings",
  {
    id: text("id")
      .$defaultFn(() => generateId("pvm"))
      .primaryKey(),
    environmentId: text("environment_id")
      .references(() => environments.id, { onDelete: "cascade" })
      .notNull(),
    bundleHash: text("bundle_hash").notNull(),
    provider: text("provider").notNull(),
    externalProductId: text("external_product_id").notNull(),
    externalPriceId: text("external_price_id").notNull(),
    componentIds: jsonb("component_ids").$type<string[]>().notNull(),
    type: text("type")
      .$type<"standalone" | "shadow_bundle">()
      .default("standalone"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    unique("pvm_unique_bundle_idx").on(
      t.environmentId,
      t.provider,
      t.bundleHash,
    ),
    index("pvm_bundle_hash_idx").on(t.bundleHash),
    index("pvm_lookup_idx").on(t.environmentId, t.provider, t.bundleHash),
  ],
);

export const providerMappingsRelations = relations(
  providerMappings,
  ({ one }) => ({
    environment: one(environments, {
      fields: [providerMappings.environmentId],
      references: [environments.id],
    }),
  }),
);
