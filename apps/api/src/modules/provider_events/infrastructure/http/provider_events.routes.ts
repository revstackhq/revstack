import { createRoute, z } from "@hono/zod-openapi";
import { createProviderEventSchema } from "@/modules/provider_events/application/use-cases/CreateProviderEvent";
import { listProviderEventsSchema } from "@/modules/provider_events/application/use-cases/ListProviderEvents";

export const createProviderEventRoute = createRoute({
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

export const listProviderEventsRoute = createRoute({
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

export const getProviderEventRoute = createRoute({
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
