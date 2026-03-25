import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createProviderEventSchema } from "@/modules/provider_events/application/commands/CreateProviderEventCommand";
import { listProviderEventsSchema } from "@/modules/provider_events/application/queries/ListProviderEventsQuery";
import type { AppEnv } from "@/container";

export const providerEventsController = new OpenAPIHono<AppEnv>();

const createProviderEventRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Provider Events"],
  summary: "Ingest a provider event",
  description:
    "Receives a raw webhook event from a payment provider for async processing.",
  request: {
    body: {
      content: { "application/json": { schema: createProviderEventSchema } },
    },
  },
  responses: {
    201: {
      description: "Event ingested",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
providerEventsController.openapi(createProviderEventRoute, async (c) => {
  const handler = c.get("providerEvents").create;
  const dto = c.req.valid("json");
  const result = await handler.handle(dto);
  return c.json(result, 201);
});

const listProviderEventsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Provider Events"],
  summary: "List provider events",
  description: "Retrieves ingested provider events with optional filtering.",
  request: { query: listProviderEventsSchema },
  responses: {
    200: {
      description: "List of events",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

providerEventsController.openapi(listProviderEventsRoute, async (c) => {
  const handler = c.get("providerEvents").list;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const getProviderEventRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Provider Events"],
  summary: "Get a provider event",
  description: "Retrieves a single provider event by ID.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "pevt_abc123" }) }),
  },
  responses: {
    200: {
      description: "Event details",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

providerEventsController.openapi(getProviderEventRoute, async (c) => {
  const handler = c.get("providerEvents").get;
  const { id } = c.req.valid("param");
  const result = await handler.handle({ id });
  return c.json(result, 200);
});
