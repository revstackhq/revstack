import { text, timestamp, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { revstack } from "@/schema/namespace";
import { generateId } from "@revstackhq/core";
import { environments } from "@/schema/core";
import { relations } from "drizzle-orm";

export const webhookEndpoints = revstack.table("webhook_endpoints", {
  id: text("id")
    .$defaultFn(() => generateId("whe"))
    .primaryKey(),
  environmentId: text("environment_id")
    .references(() => environments.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  signingSecret: text("signing_secret").notNull(),
  description: text("description"),
  enabledEvents: jsonb("enabled_events").default([]).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const webhookDeliveries = revstack.table("webhook_deliveries", {
  id: text("id")
    .$defaultFn(() => generateId("whd"))
    .primaryKey(),
  endpointId: text("endpoint_id")
    .references(() => webhookEndpoints.id, { onDelete: "cascade" })
    .notNull(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  statusCode: integer("status_code"),
  success: boolean("success").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const webhookEndpointsRelations = relations(
  webhookEndpoints,
  ({ one, many }) => ({
    environment: one(environments, {
      fields: [webhookEndpoints.environmentId],
      references: [environments.id],
    }),
    webhookDeliveries: many(webhookDeliveries),
  }),
);

export const webhookDeliveriesRelations = relations(
  webhookDeliveries,
  ({ one }) => ({
    webhookEndpoint: one(webhookEndpoints, {
      fields: [webhookDeliveries.endpointId],
      references: [webhookEndpoints.id],
    }),
  }),
);
