import { text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@/utils/id";
import { environments } from "@/schema/core";
import { studioAdmins } from "@/schema/studio";

export const auditLogs = revstack.table("audit_logs", {
  id: text("id").$defaultFn(() => generateId("alog")).primaryKey(),
  environmentId: text("environment_id").references(() => environments.id, { onDelete: "cascade" }).notNull(),
  actorId: text("actor_id").references(() => studioAdmins.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  environment: one(environments, { fields: [auditLogs.environmentId], references: [environments.id] }),
  studioAdmin: one(studioAdmins, { fields: [auditLogs.actorId], references: [studioAdmins.id] }),
}));
