import {
  text,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { FEATURE_TYPES, UNIT_TYPES, generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import { usageMeters } from "@/schema/usages";

export const entitlementTypeEnum = revstack.enum(
  "entitlement_type",
  FEATURE_TYPES,
);

export const unitTypeEnum = revstack.enum("unit_type", UNIT_TYPES);

export const entitlementStatusEnum = revstack.enum("entitlement_status", [
  "draft",
  "active",
  "archived",
]);

export const entitlements = revstack.table(
  "entitlements",
  {
    id: text("id")
      .$defaultFn(() => generateId("ent"))
      .primaryKey(),
    environmentId: text("environment_id")
      .references(() => environments.id, { onDelete: "cascade" })
      .notNull(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    type: entitlementTypeEnum("type").notNull(),
    unitType: unitTypeEnum("unit_type").notNull(),
    status: entitlementStatusEnum("status").notNull().default("active"),
    metadata: jsonb("metadata").default({}),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("ent_env_slug_idx").on(t.environmentId, t.slug),
    index("ent_env_status_idx").on(t.environmentId, t.status),
  ],
);

export const entitlementsRelations = relations(
  entitlements,
  ({ one, many }) => ({
    environment: one(environments, {
      fields: [entitlements.environmentId],
      references: [environments.id],
    }),
    usageMeters: many(usageMeters),
  }),
);
