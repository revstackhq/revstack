import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createPlanSchema } from "@/modules/plans/application/commands/CreatePlanCommand";
import type { AppEnv } from "@/container";

export const plansController = new OpenAPIHono<AppEnv>();

const createPlanRoute = createRoute({
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

plansController.openapi(createPlanRoute, async (c) => {
  const handler = c.get("plans").create;
  const dto = c.req.valid("json");
  const id = await handler.handle(dto);
  return c.json({ id, success: true }, 201);
});

const listPlansRoute = createRoute({
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

plansController.openapi(listPlansRoute, async (c) => {
  const handler = c.get("plans").list;
  const result = await handler.handle({});
  return c.json(result, 200);
});

const archivePlanRoute = createRoute({
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

plansController.openapi(archivePlanRoute, async (c) => {
  const handler = c.get("plans").archive;
  const { id } = c.req.valid("param");
  await handler.handle({ id });
  return c.json({ success: true, message: "Plan archived successfully" }, 200);
});

const hidePlanRoute = createRoute({
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

plansController.openapi(hidePlanRoute, async (c) => {
  const handler = c.get("plans").hide;
  const { id } = c.req.valid("param");
  await handler.handle({ id });
  return c.json({ success: true, message: "Plan hidden successfully" }, 200);
});
