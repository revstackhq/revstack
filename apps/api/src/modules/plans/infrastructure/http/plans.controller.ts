import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createPlanRoute,
  listPlansRoute,
  archivePlanRoute,
  hidePlanRoute,
  createPlanEntitlementRoute,
  listPlanEntitlementsRoute,
  getPlanEntitlementRoute,
  updatePlanEntitlementLimitsRoute,
  deletePlanEntitlementRoute,
} from "@/modules/plans/infrastructure/http/plans.routes";

export const plansController = new OpenAPIHono<AppEnv>();

// --- Plan Handlers ---

plansController.openapi(createPlanRoute, async (c) => {
  const handler = c.get("plans").create;
  const dto = c.req.valid("json");
  const id = await handler.execute(dto);
  return c.json({ id, success: true }, 201);
});

plansController.openapi(listPlansRoute, async (c) => {
  const handler = c.get("plans").list;
  const result = await handler.execute({});
  return c.json(result, 200);
});

plansController.openapi(archivePlanRoute, async (c) => {
  const handler = c.get("plans").archive;
  const { id } = c.req.valid("param");
  await handler.execute({ id });
  return c.json({ success: true, message: "Plan archived successfully" }, 200);
});

plansController.openapi(hidePlanRoute, async (c) => {
  const handler = c.get("plans").hide;
  const { id } = c.req.valid("param");
  await handler.execute({ id });
  return c.json({ success: true, message: "Plan hidden successfully" }, 200);
});

// --- Plan Entitlement Handlers (nested under /:planId/entitlements) ---

plansController.openapi(createPlanEntitlementRoute, async (c) => {
  const handler = c.get("planEntitlements").create;
  const { planId, featureId } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ ...dto, planId, entitlementId: featureId });
  return c.json(result, 200);
});

plansController.openapi(listPlanEntitlementsRoute, async (c) => {
  const handler = c.get("planEntitlements").list;
  const { planId } = c.req.valid("param");
  const query = c.req.valid("query");
  const result = await handler.execute({ ...query, planId });
  return c.json(result, 200);
});

plansController.openapi(getPlanEntitlementRoute, async (c) => {
  const handler = c.get("planEntitlements").get;
  const { planId, featureId } = c.req.valid("param");
  const result = await handler.execute({ planId, entitlementId: featureId });
  return c.json(result, 200);
});

plansController.openapi(updatePlanEntitlementLimitsRoute, async (c) => {
  const handler = c.get("planEntitlements").updateLimits;
  const { planId, featureId } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ ...dto, planId, entitlementId: featureId });
  return c.json(result, 200);
});

plansController.openapi(deletePlanEntitlementRoute, async (c) => {
  const handler = c.get("planEntitlements").delete;
  const { planId, featureId } = c.req.valid("param");
  const result = await handler.execute({ planId, entitlementId: featureId });
  return c.json(result, 200);
});
