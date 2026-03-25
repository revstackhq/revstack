import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createProviderEventSchema } from "@/modules/provider_events/application/commands/CreateProviderEventCommand";
import { listProviderEventsSchema } from "@/modules/provider_events/application/queries/ListProviderEventsQuery";
import type { AppEnv } from "@/container";

export const providerEventsController = new Hono<AppEnv>();

providerEventsController.post(
  "/",
  zValidator("json", createProviderEventSchema),
  async (c) => {
    const handler = c.get("providerEvents").create;
    const dto = c.req.valid("json");
    const result = await handler.handle(dto);
    return c.json(result, 201);
  }
);

providerEventsController.get(
  "/",
  zValidator("query", listProviderEventsSchema),
  async (c) => {
    const handler = c.get("providerEvents").list;
    const query = c.req.valid("query");
    const result = await handler.handle(query);
    return c.json(result, 200);
  }
);

providerEventsController.get("/:id", async (c) => {
  const handler = c.get("providerEvents").get;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});
