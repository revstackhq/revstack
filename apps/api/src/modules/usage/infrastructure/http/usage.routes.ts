import { createRoute, z } from "@hono/zod-openapi";
import { recordUsageSchema } from "@/modules/usage/application/use-cases/RecordUsage";
import { createUsageMeterSchema } from "@/modules/usage/application/use-cases/CreateUsageMeter";
import { updateUsageMeterSchema } from "@/modules/usage/application/use-cases/UpdateUsageMeter";
import { listUsagesSchema } from "@/modules/usage/application/use-cases/ListUsages";

export const recordUsageRoute = createRoute({
  method: "post",
  path: "/record",
  tags: ["Usage"],
  summary: "Record usage event",
  description:
    "Records a metered usage event for a customer against a feature entitlement.",
  request: {
    body: { content: { "application/json": { schema: recordUsageSchema } } },
  },
  responses: {
    200: {
      description: "Usage recorded",
      content: {
        "application/json": {
          schema: z.object({ id: z.string(), success: z.boolean() }),
        },
      },
    },
  },
});

export const getUsageMeterRoute = createRoute({
  method: "get",
  path: "/meters/{customerId}/{featureId}",
  tags: ["Usage"],
  summary: "Get a usage meter",
  description: "Retrieves the current usage meter for a customer-feature pair.",
  request: {
    params: z.object({
      customerId: z.string().openapi({ example: "cust_abc123" }),
      featureId: z.string().openapi({ example: "feat_api_calls" }),
    }),
  },
  responses: {
    200: {
      description: "Usage meter",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

export const listUsagesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Usage"],
  summary: "List usage records",
  description: "Retrieves usage records with optional filtering.",
  request: { query: listUsagesSchema },
  responses: {
    200: {
      description: "List of usage records",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

export const createUsageMeterRoute = createRoute({
  method: "post",
  path: "/meters",
  tags: ["Usage"],
  summary: "Create a usage meter",
  description:
    "Creates a new usage meter definition for tracking feature consumption.",
  request: {
    body: {
      content: { "application/json": { schema: createUsageMeterSchema } },
    },
  },
  responses: {
    201: {
      description: "Usage meter created",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

export const updateUsageMeterRoute = createRoute({
  method: "patch",
  path: "/meters/{id}",
  tags: ["Usage"],
  summary: "Update a usage meter",
  description: "Updates configuration of an existing usage meter.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "meter_abc123" }) }),
    body: {
      content: { "application/json": { schema: updateUsageMeterSchema } },
    },
  },
  responses: {
    200: {
      description: "Usage meter updated",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
