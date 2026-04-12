import { text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import { workspaceMembers } from "@/schema/workspaces";

export const auditLogs = revstack.table(
  "audit_logs",
  {
    id: text("id")
      .$defaultFn(() => generateId("alog"))
      .primaryKey(),
    environmentId: text("environment_id")
      .references(() => environments.id, { onDelete: "cascade" })
      .notNull(),
    actorId: text("actor_id").references(() => workspaceMembers.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    resource: text("resource").notNull(),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("alog_env_idx").on(t.environmentId),
    index("alog_env_created_idx").on(t.environmentId, t.createdAt),
  ],
);

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  environment: one(environments, {
    fields: [auditLogs.environmentId],
    references: [environments.id],
  }),
  workspaceMember: one(workspaceMembers, {
    fields: [auditLogs.actorId],
    references: [workspaceMembers.id],
  }),
}));
