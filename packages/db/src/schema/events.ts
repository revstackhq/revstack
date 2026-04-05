import { text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import { eventTypeEnum } from "@/schema/enums";

export const providerEvents = revstack.table("provider_events", {
  id: text("id")
    .$defaultFn(() => generateId("pevt"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  providerId: text("provider_id").notNull(),
  providerEventId: text("provider_event_id").notNull(),
  type: eventTypeEnum("type").notNull(),
  resourceId: text("resource_id").notNull(),
  customerId: text("customer_id"),
  payload: jsonb("payload").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const providerEventsRelations = relations(providerEvents, ({ one }) => ({
  environment: one(environments, {
    fields: [providerEvents.environmentId],
    references: [environments.id],
  }),
}));
