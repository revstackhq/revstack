import { createRoute, z } from "@hono/zod-openapi";
import { createPlanSchema } from "@/modules/plans/application/use-cases/CreatePlan";
import { createPlanEntitlementSchema } from "@/modules/plans/application/use-cases/CreatePlanEntitlement";
import { updatePlanEntitlementLimitsSchema } from "@/modules/plans/application/use-cases/UpdatePlanEntitlementLimits";
import { listPlanEntitlementsSchema } from "@/modules/plans/application/use-cases/ListPlanEntitlements";

// --- Plan Routes ---

export const createPlanRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Plans"],
  summary: "Create a plan",
  description: "Creates a new billing plan with pricing and entitlement associations.",
  request: {
    body: { content: { "application/json": { schema: createPlanSchema } } },
  },
  responses: {
    201: {
      description: "Plan created",
      content: { "application/json": { schema: z.object({ id: z.string(), success: z.boolean() }) } },
    },
    400: { description: "Validation error" },
  },
});

export const listPlansRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Plans"],
  summary: "List plans",
  description: "Retrieves all available billing plans.",
  responses: {
    200: {
      description: "List of plans",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

export const archivePlanRoute = createRoute({
  method: "patch",
  path: "/{id}/archive",
  tags: ["Plans"],
  summary: "Archive a plan",
  description: "Marks a plan as archived, preventing new subscriptions.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "plan_abc123" }) }),
  },
  responses: {
    200: {
      description: "Plan archived",
      content: { "application/json": { schema: z.object({ success: z.boolean(), message: z.string() }) } },
    },
  },
});

export const hidePlanRoute = createRoute({
  method: "patch",
  path: "/{id}/hide",
  tags: ["Plans"],
  summary: "Hide a plan",
  description: "Hides a plan from public visibility while keeping it active for existing subscribers.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "plan_abc123" }) }),
  },
  responses: {
    200: {
      description: "Plan hidden",
      content: { "application/json": { schema: z.object({ success: z.boolean(), message: z.string() }) } },
    },
  },
});

// --- Plan Entitlement Routes (nested under /:planId/entitlements) ---

export const createPlanEntitlementRoute = createRoute({
  method: "put",
  path: "/{planId}/entitlements/{featureId}",
  tags: ["Plan Entitlements"],
  summary: "Attach or update an entitlement on a plan",
  description: "Links an entitlement definition to a plan with optional limits.",
  request: {
    params: z.object({
      planId: z.string().openapi({ example: "plan_abc123" }),
      featureId: z.string().openapi({ example: "feat_ai_tokens" }),
    }),
    body: {
      content: { "application/json": { schema: createPlanEntitlementSchema } },
    },
  },
  responses: {
    200: {
      description: "Plan entitlement saved",
      content: { "application/json": { schema: z.any() } },
    },
    400: { description: "Validation error" },
  },
});

export const listPlanEntitlementsRoute = createRoute({
  method: "get",
  path: "/{planId}/entitlements",
  tags: ["Plan Entitlements"],
  summary: "List entitlements for a plan",
  description: "Retrieves all entitlements linked to a specific plan.",
  request: {
    params: z.object({
      planId: z.string().openapi({ example: "plan_abc123" }),
    }),
    query: listPlanEntitlementsSchema,
  },
  responses: {
    200: {
      description: "List of plan entitlements",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

export const getPlanEntitlementRoute = createRoute({
  method: "get",
  path: "/{planId}/entitlements/{featureId}",
  tags: ["Plan Entitlements"],
  summary: "Get a plan entitlement",
  description: "Retrieves a specific plan-entitlement association.",
  request: {
    params: z.object({
      planId: z.string().openapi({ example: "plan_abc123" }),
      featureId: z.string().openapi({ example: "feat_ai_tokens" }),
    }),
  },
  responses: {
    200: {
      description: "Plan entitlement details",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

export const updatePlanEntitlementLimitsRoute = createRoute({
  method: "patch",
  path: "/{planId}/entitlements/{featureId}",
  tags: ["Plan Entitlements"],
  summary: "Update plan entitlement limits",
  description: "Updates the limit values for a plan-entitlement association.",
  request: {
    params: z.object({
      planId: z.string().openapi({ example: "plan_abc123" }),
      featureId: z.string().openapi({ example: "feat_ai_tokens" }),
    }),
    body: {
      content: { "application/json": { schema: updatePlanEntitlementLimitsSchema } },
    },
  },
  responses: {
    200: {
      description: "Plan entitlement limits updated",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

export const deletePlanEntitlementRoute = createRoute({
  method: "delete",
  path: "/{planId}/entitlements/{featureId}",
  tags: ["Plan Entitlements"],
  summary: "Detach an entitlement from a plan",
  description: "Removes a plan-entitlement association.",
  request: {
    params: z.object({
      planId: z.string().openapi({ example: "plan_abc123" }),
      featureId: z.string().openapi({ example: "feat_ai_tokens" }),
    }),
  },
  responses: {
    200: {
      description: "Plan entitlement removed",
      content: { "application/json": { schema: z.any() } },
    },
  },
});
