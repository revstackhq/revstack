import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createPlanEntitlementSchema } from "@/modules/plan_entitlements/application/commands/CreatePlanEntitlementCommand";
import { updatePlanEntitlementLimitsSchema } from "@/modules/plan_entitlements/application/commands/UpdatePlanEntitlementLimitsCommand";
import { listPlanEntitlementsSchema } from "@/modules/plan_entitlements/application/queries/ListPlanEntitlementsQuery";
import { type AppEnv } from "@/container";

export const planEntitlementsController = new Hono<AppEnv>();

planEntitlementsController.post(
  "/:planId",
  zValidator("json", createPlanEntitlementSchema),
  async (c) => {
    const handler = c.get("planEntitlements").create;
    const dto = c.req.valid("json");
    const planId = c.req.param("planId");
    const result = await handler.handle({ ...dto, planId });
    return c.json(result, 201);
  },
);

planEntitlementsController.get(
  "/",
  zValidator("query", listPlanEntitlementsSchema),
  async (c) => {
    const handler = c.get("planEntitlements").list;
    const query = c.req.valid("query");
    const result = await handler.handle(query);
    return c.json(result);
  },
);

planEntitlementsController.get("/:planId/:entitlementId", async (c) => {
  const handler = c.get("planEntitlements").get;
  const result = await handler.handle({
    planId: c.req.param("planId"),
    entitlementId: c.req.param("entitlementId"),
  });
  return c.json(result);
});

planEntitlementsController.patch(
  "/:planId/:entitlementId",
  zValidator("json", updatePlanEntitlementLimitsSchema),
  async (c) => {
    const handler = c.get("planEntitlements").updateLimits;
    const dto = c.req.valid("json");
    const result = await handler.handle({
      ...dto,
      planId: c.req.param("planId"),
      entitlementId: c.req.param("entitlementId"),
    });
    return c.json(result);
  },
);

planEntitlementsController.delete("/:planId/:entitlementId", async (c) => {
  const handler = c.get("planEntitlements").delete;
  const result = await handler.handle({
    planId: c.req.param("planId"),
    entitlementId: c.req.param("entitlementId"),
  });
  return c.json(result, 200);
});
