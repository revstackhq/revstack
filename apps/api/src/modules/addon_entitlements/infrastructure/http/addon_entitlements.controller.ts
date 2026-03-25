import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createAddonEntitlementSchema } from "@/modules/addon_entitlements/application/commands/CreateAddonEntitlementCommand";
import { listAddonEntitlementsSchema } from "@/modules/addon_entitlements/application/queries/ListAddonEntitlementsQuery";
import { type AppEnv } from "@/container";

export const addonEntitlementsController = new Hono<AppEnv>();

addonEntitlementsController.post(
  "/:addonId",
  zValidator("json", createAddonEntitlementSchema),
  async (c) => {
    const handler = c.get("addonEntitlements").create;
    const dto = c.req.valid("json");
    const addonId = c.req.param("addonId");
    const result = await handler.handle({ ...dto, addonId });
    return c.json(result, 201);
  },
);

addonEntitlementsController.get(
  "/",
  zValidator("query", listAddonEntitlementsSchema),
  async (c) => {
    const handler = c.get("addonEntitlements").list;
    const query = c.req.valid("query");
    const result = await handler.handle(query);
    return c.json(result);
  },
);

addonEntitlementsController.get("/:addonId/:entitlementId", async (c) => {
  const handler = c.get("addonEntitlements").get;
  const result = await handler.handle({
    addonId: c.req.param("addonId"),
    entitlementId: c.req.param("entitlementId"),
  });
  return c.json(result);
});

addonEntitlementsController.delete("/:addonId/:entitlementId", async (c) => {
  const handler = c.get("addonEntitlements").delete;
  const result = await handler.handle({
    addonId: c.req.param("addonId"),
    entitlementId: c.req.param("entitlementId"),
  });
  return c.json(result, 200);
});
