import { OpenAPIHono, z } from "@hono/zod-openapi";
import { createCustomerSchema } from "@/modules/customers/application/commands/CreateCustomerCommand";
import { createManyCustomersCommandSchema } from "@/modules/customers/application/commands/CreateManyCustomersCommand";
import type { AppEnv } from "@/container";
import { apiKeyMiddleware } from "@/common/middlewares/api-key";
import {
  bulkCreateRoute,
  createCustomerRoute,
  deleteCustomerRoute,
  getCustomerRoute,
  listCustomersRoute,
  updateCustomerRoute,
} from "@/modules/customers/infrastructure/http/customers.routes";

export const customersController = new OpenAPIHono<AppEnv>();

customersController.use("*", apiKeyMiddleware);

// POST /
customersController.openapi(createCustomerRoute, async (c) => {
  const body = await c.req.json();
  const environmentId = c.get("environmentId");

  const command = createCustomerSchema.parse({
    ...body,
    environmentId,
  });

  const result = await c.get("customers").create.handle(command);

  return c.json({ id: result }, 201);
});

// GET / (List)
customersController.openapi(listCustomersRoute, async (c) => {
  const environmentId = c.get("environmentId");
  const { limit, offset } = c.req.valid("query");

  const result = await c.get("customers").list.handle({
    environmentId,
    limit: Number(limit) || 10,
    offset: Number(offset) || 0,
  });

  return c.json(result, 200);
});

// GET /:id (Retrieve)
customersController.openapi(getCustomerRoute, async (c) => {
  const environmentId = c.get("environmentId");
  const { id } = c.req.valid("param");

  const result = await c.get("customers").get.handle({ id, environmentId });

  if (!result) return c.json({ error: "Customer not found" }, 404);
  return c.json(result, 200);
});

// PATCH /:id (Update)
customersController.openapi(updateCustomerRoute, async (c) => {
  const environmentId = c.get("environmentId");
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");

  const result = await c
    .get("customers")
    .update.handle({ id, environmentId, ...body });

  return c.json(result, 200);
});

// POST /bulk (Bulk Create)
customersController.openapi(bulkCreateRoute, async (c) => {
  const body = await c.req.json();
  const environmentId = c.get("environmentId");

  const command = createManyCustomersCommandSchema.parse({
    environmentId,
    customers: body.customers,
  });

  const result = await c.get("customers").createMany.handle(command);
  return c.json(result);
});

// DELETE /:id ---
customersController.openapi(deleteCustomerRoute, async (c) => {
  const environmentId = c.get("environmentId");
  const { id } = c.req.valid("param");

  await c.get("customers").delete.handle({ id, environmentId });
  return c.json({ success: true }, 200);
});
