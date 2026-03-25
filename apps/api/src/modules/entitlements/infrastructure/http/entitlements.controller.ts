import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createEntitlementSchema } from "@/modules/entitlements/application/commands/CreateEntitlementCommand";
import { AppEnv } from "@/container";
import { listEntitlementsSchema } from "@/modules/entitlements/application/queries/ListEntitlementsQuery";

export const entitlementsController = new Hono<AppEnv>();

entitlementsController.get(
  "/",
  zValidator("query", listEntitlementsSchema),
  async (c) => {
    const handler = c.get("entitlements").list;
    const query = c.req.valid("query");
    const result = await handler.handle(query);
    return c.json(result);
  },
);

entitlementsController.post(
  "/",
  zValidator("json", createEntitlementSchema),
  async (c) => {
    const handler = c.get("entitlements").create;
    const dto = c.req.valid("json");
    const result = await handler.handle(dto);
    return c.json(result, 201);
  },
);

entitlementsController.delete("/:id", async (c) => {
  const handler = c.get("entitlements").delete;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});
