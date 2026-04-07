import { text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import {
  entitlementStatusEnum,
  entitlementTypeEnum,
  unitTypeEnum,
} from "@/schema/enums";
import { usageMeters } from "@/schema/usages";

export const entitlements = revstack.table("entitlements", {
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
});

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
