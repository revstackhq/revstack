import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { recordUsageSchema } from "@/modules/usage/application/commands/RecordUsageCommand";
import { createUsageMeterSchema } from "@/modules/usage/application/commands/CreateUsageMeterCommand";
import { updateUsageMeterSchema } from "@/modules/usage/application/commands/UpdateUsageMeterCommand";
import { listUsagesSchema } from "@/modules/usage/application/queries/ListUsagesQuery";
import type { AppEnv } from "@/container";

export const usageController = new OpenAPIHono<AppEnv>();

const recordUsageRoute = createRoute({
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

usageController.openapi(recordUsageRoute, async (c) => {
  const handler = c.get("usage").record;
  const dto = c.req.valid("json");
  const id = await handler.handle(dto);
  return c.json({ id, success: true }, 200);
});

const getUsageMeterRoute = createRoute({
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

usageController.openapi(getUsageMeterRoute, async (c) => {
  const handler = c.get("usage").getMeter;
  const { customerId, featureId } = c.req.valid("param");
  const result = await handler.handle({ customerId, featureId });
  return c.json(result, 200);
});

const listUsagesRoute = createRoute({
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

usageController.openapi(listUsagesRoute, async (c) => {
  const handler = c.get("usage").list;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const createUsageMeterRoute = createRoute({
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

usageController.openapi(createUsageMeterRoute, async (c) => {
  const handler = c.get("usage").createMeter;
  const dto = c.req.valid("json");
  const result = await handler.handle(dto);
  return c.json(result, 201);
});

const updateUsageMeterRoute = createRoute({
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

usageController.openapi(updateUsageMeterRoute, async (c) => {
  const handler = c.get("usage").updateMeter;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.handle({ id, ...dto });
  return c.json(result, 200);
});
