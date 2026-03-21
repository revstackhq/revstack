import { text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { revstack } from "@/schema/namespace";
import { generateId } from "@/utils/id";
import { environments } from "@/schema/core";

export const studioAdmins = revstack.table("studio_admins", {
  id: text("id").$defaultFn(() => generateId("admin")).primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  isSuperadmin: boolean("is_superadmin").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = revstack.table("audit_logs", {
  id: text("id").$defaultFn(() => generateId("alog")).primaryKey(),
  environmentId: text("environment_id").references(() => environments.id, { onDelete: "cascade" }).notNull(),
  actorId: text("actor_id").references(() => studioAdmins.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
