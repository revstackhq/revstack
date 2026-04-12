import {
  text,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { revstack } from "@/schema/namespace";
import { PROVIDER_EVENT_TYPES, generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";

export const providerEventTypeEnum = revstack.enum(
  "provider_event_type",
  PROVIDER_EVENT_TYPES,
);

export const providerEventStatusEnum = revstack.enum("provider_event_status", [
  "pending",
  "processed",
  "failed",
]);

export const providerEvents = revstack.table(
  "provider_events",
  {
    id: text("id")
      .$defaultFn(() => generateId("pevt"))
      .primaryKey(),
    environmentId: text("environment_id")
      .references(() => environments.id, { onDelete: "cascade" })
      .notNull(),
    providerId: text("provider_id").notNull(),
    externalEventId: text("external_event_id").notNull(),
    type: providerEventTypeEnum("type").notNull(),
    resourceId: text("resource_id").notNull(),
    customerId: text("customer_id"),
    status: providerEventStatusEnum("status").default("pending").notNull(),
    payload: jsonb("payload").notNull(),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("pevt_env_external_idx").on(t.environmentId, t.externalEventId),
    index("pevt_env_status_idx").on(t.environmentId, t.status),
  ],
);

export const providerEventsRelations = relations(providerEvents, ({ one }) => ({
  environment: one(environments, {
    fields: [providerEvents.environmentId],
    references: [environments.id],
  }),
}));
