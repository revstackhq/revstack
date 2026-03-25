import { text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@/utils/id";
import { environments } from "@/schema/core";
import { statusEnum } from "@/schema/enums";

export const integrations = revstack.table("integrations", {
  id: text("id").$defaultFn(() => generateId("int")).primaryKey(),
  environmentId: text("environment_id").references(() => environments.id, { onDelete: "cascade" }).notNull(),
  provider: text("provider").notNull(),
  config: jsonb("config").notNull().default({}),
  status: statusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const integrationsRelations = relations(integrations, ({ one }) => ({
  environment: one(environments, { fields: [integrations.environmentId], references: [environments.id] }),
}));
