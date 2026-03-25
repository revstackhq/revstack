import { text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@/utils/id";
import { auditLogs } from "@/schema/logs";

export const studioAdmins = revstack.table("studio_admins", {
  id: text("id")
    .$defaultFn(() => generateId("admin"))
    .primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  isSuperadmin: boolean("is_superadmin").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const studioAdminsRelations = relations(studioAdmins, ({ many }) => ({
  auditLogs: many(auditLogs),
}));
