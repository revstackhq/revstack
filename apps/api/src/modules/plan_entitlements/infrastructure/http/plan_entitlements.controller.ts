import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createPlanEntitlementSchema } from "@/modules/plan_entitlements/application/commands/CreatePlanEntitlementCommand";
import { updatePlanEntitlementLimitsSchema } from "@/modules/plan_entitlements/application/commands/UpdatePlanEntitlementLimitsCommand";
import { listPlanEntitlementsSchema } from "@/modules/plan_entitlements/application/queries/ListPlanEntitlementsQuery";
import type { AppEnv } from "@/container";

export const planEntitlementsController = new OpenAPIHono<AppEnv>();

const createPlanEntitlementRoute = createRoute({
  method: "post",
  path: "/{planId}",
  tags: ["Plan Entitlements"],
  summary: "Attach an entitlement to a plan",
  description:
    "Links an entitlement definition to a plan with optional limits.",
  request: {
    params: z.object({
      planId: z.string().openapi({ example: "plan_abc123" }),
    }),
    body: {
      content: { "application/json": { schema: createPlanEntitlementSchema } },
    },
  },
  responses: {
    201: {
      description: "Plan entitlement created",
      content: { "application/json": { schema: z.any() } },
    },
    400: { description: "Validation error" },
  },
});
planEntitlementsController.openapi(createPlanEntitlementRoute, async (c) => {
  const handler = c.get("planEntitlements").create;
  const { planId } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.handle({ ...dto, planId });
  return c.json(result, 201);
});

const listPlanEntitlementsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Plan Entitlements"],
  summary: "List plan entitlements",
  description:
    "Retrieves all entitlements linked to plans, optionally filtered by planId.",
  request: { query: listPlanEntitlementsSchema },
  responses: {
    200: {
      description: "List of plan entitlements",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});
planEntitlementsController.openapi(listPlanEntitlementsRoute, async (c) => {
  const handler = c.get("planEntitlements").list;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

const getPlanEntitlementRoute = createRoute({
  method: "get",
  path: "/{planId}/{entitlementId}",
  tags: ["Plan Entitlements"],
  summary: "Get a plan entitlement",
  description:
    "Retrieves a specific plan-entitlement association by composite key.",
  request: {
    params: z.object({
      planId: z.string().openapi({ example: "plan_abc123" }),
      entitlementId: z.string().openapi({ example: "ent_abc123" }),
    }),
  },
  responses: {
    200: {
      description: "Plan entitlement details",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

planEntitlementsController.openapi(getPlanEntitlementRoute, async (c) => {
  const handler = c.get("planEntitlements").get;
  const { planId, entitlementId } = c.req.valid("param");
  const result = await handler.handle({ planId, entitlementId });
  return c.json(result, 200);
});

const updatePlanEntitlementLimitsRoute = createRoute({
  method: "patch",
  path: "/{planId}/{entitlementId}",
  tags: ["Plan Entitlements"],
  summary: "Update plan entitlement limits",
  description: "Updates the limit values for a plan-entitlement association.",
  request: {
    params: z.object({
      planId: z.string().openapi({ example: "plan_abc123" }),
      entitlementId: z.string().openapi({ example: "ent_abc123" }),
    }),
    body: {
      content: {
        "application/json": { schema: updatePlanEntitlementLimitsSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Plan entitlement limits updated",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
planEntitlementsController.openapi(
  updatePlanEntitlementLimitsRoute,
  async (c) => {
    const handler = c.get("planEntitlements").updateLimits;
    const { planId, entitlementId } = c.req.valid("param");
    const dto = c.req.valid("json");
    const result = await handler.handle({ ...dto, planId, entitlementId });
    return c.json(result, 200);
  },
);

const deletePlanEntitlementRoute = createRoute({
  method: "delete",
  path: "/{planId}/{entitlementId}",
  tags: ["Plan Entitlements"],
  summary: "Detach an entitlement from a plan",
  description: "Removes a plan-entitlement association.",
  request: {
    params: z.object({
      planId: z.string().openapi({ example: "plan_abc123" }),
      entitlementId: z.string().openapi({ example: "ent_abc123" }),
    }),
  },
  responses: {
    200: {
      description: "Plan entitlement removed",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
planEntitlementsController.openapi(deletePlanEntitlementRoute, async (c) => {
  const handler = c.get("planEntitlements").delete;
  const { planId, entitlementId } = c.req.valid("param");
  const result = await handler.handle({ planId, entitlementId });
  return c.json(result, 200);
});
