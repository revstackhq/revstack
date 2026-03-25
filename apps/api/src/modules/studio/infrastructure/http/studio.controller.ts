import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { createStudioAdminSchema } from "@/modules/studio/application/commands/CreateStudioAdminCommand";
import { updateStudioAdminSchema } from "@/modules/studio/application/commands/UpdateStudioAdminCommand";
import type { AppEnv } from "@/container";

export const studioController = new OpenAPIHono<AppEnv>();

const createAdminRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Studio"],
  summary: "Create a studio admin",
  description: "Creates a new admin user for the Revstack Studio dashboard.",
  request: {
    body: {
      content: { "application/json": { schema: createStudioAdminSchema } },
    },
  },
  responses: {
    201: {
      description: "Admin created",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

studioController.openapi(createAdminRoute, async (c) => {
  const handler = c.get("studio").createAdmin;
  const dto = c.req.valid("json");
  const result = await handler.handle(dto);
  return c.json(result, 201);
});

const listAdminsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Studio"],
  summary: "List studio admins",
  description: "Retrieves all studio admin users.",
  responses: {
    200: {
      description: "List of admins",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});
studioController.openapi(listAdminsRoute, async (c) => {
  const handler = c.get("studio").listAdmins;
  const result = await handler.handle({});
  return c.json(result, 200);
});

const getAdminRoute = createRoute({
  method: "get",
  path: "/{idOrEmail}",
  tags: ["Studio"],
  summary: "Get a studio admin",
  description: "Retrieves a studio admin by ID or email address.",
  request: {
    params: z.object({
      idOrEmail: z.string().openapi({ example: "admin_abc123" }),
    }),
  },
  responses: {
    200: {
      description: "Admin details",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

studioController.openapi(getAdminRoute, async (c) => {
  const handler = c.get("studio").getAdmin;
  const { idOrEmail } = c.req.valid("param");
  const result = await handler.handle({ idOrEmail });
  return c.json(result, 200);
});

const updateAdminRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Studio"],
  summary: "Update a studio admin",
  description: "Updates name or password of an existing studio admin.",
  request: {
    params: z.object({ id: z.string().openapi({ example: "admin_abc123" }) }),
    body: {
      content: { "application/json": { schema: updateStudioAdminSchema } },
    },
  },
  responses: {
    200: {
      description: "Admin updated",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

studioController.openapi(updateAdminRoute, async (c) => {
  const handler = c.get("studio").updateAdmin;
  const { id } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.handle({ adminId: id, ...dto });
  return c.json(result, 200);
});
