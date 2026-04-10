import { text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { auditLogs } from "@/schema/logs";
import { environments } from "@/schema/core";
import { workspaceRoleEnum } from "@/schema/enums";

export const workspaceMembers = revstack.table("workspace_members", {
  id: text("id")
    .$defaultFn(() => generateId("mem"))
    .primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  role: workspaceRoleEnum("role").default("admin").notNull(),
  environmentId: text("environment_id")
    .references(() => environments.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ many, one }) => ({
    auditLogs: many(auditLogs),
    environment: one(environments, {
      fields: [workspaceMembers.environmentId],
      references: [environments.id],
    }),
  }),
);
