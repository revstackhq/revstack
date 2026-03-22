import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createEntitlementSchema } from "@/modules/entitlements/application/commands/CreateEntitlementCommand";
import { AppEnv } from "@/container";

export const entitlementsController = new Hono<AppEnv>();

entitlementsController.get("/", async (c) => {
  return c.json({ data: [] });
});

entitlementsController.post(
  "/",
  zValidator("json", createEntitlementSchema),
  async (c) => {
    const dto = c.req.valid("json");
    return c.json({ id: "123", success: true }, 201);
  },
);
