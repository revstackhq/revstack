import { OpenAPIHono } from "@hono/zod-openapi";
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
  const dto = c.req.valid("json");
  const environmentId = c.get("environmentId");

  const result = await c.get("customers").create.execute({
    ...dto,
    environment_id: environmentId,
  });

  return c.json(result, 201);
});

// GET / (List)
customersController.openapi(listCustomersRoute, async (c) => {
  const environmentId = c.get("environmentId");
  const { limit, offset } = c.req.valid("query");

  const result = await c.get("customers").list.execute({
    environment_id: environmentId,
    limit: Number(limit) || 10,
    offset: Number(offset) || 0,
  });

  return c.json(result, 200);
});

// GET /:id (Retrieve)
customersController.openapi(getCustomerRoute, async (c) => {
  const environmentId = c.get("environmentId");
  const { id } = c.req.valid("param");

  const result = await c.get("customers").list.execute({
    environment_id: environmentId,
    limit: 1,
    offset: 0,
  });

  const customer = result[0];
  if (!customer) return c.json({ error: "Customer not found" }, 404);
  return c.json(customer, 200);
});

// PATCH /:id (Update) — placeholder until UpdateCustomer use-case is added
// customersController.openapi(updateCustomerRoute, async (c) => {
// return c.json({ error: "Not implemented" }, 501);
// });

// POST /bulk (Bulk Create)
customersController.openapi(bulkCreateRoute, async (c) => {
  const dto = c.req.valid("json");
  const environmentId = c.get("environmentId");

  const result = await c.get("customers").createMany.execute({
    environment_id: environmentId,
    customers: dto.customers,
  });
  return c.json(result);
});

// DELETE /:id
customersController.openapi(deleteCustomerRoute, async (c) => {
  const environmentId = c.get("environmentId");
  const { id } = c.req.valid("param");

  await c.get("customers").delete.execute({
    id,
    environment_id: environmentId,
  });
  return c.json({ success: true }, 200);
});
