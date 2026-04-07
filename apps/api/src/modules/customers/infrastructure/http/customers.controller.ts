import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  createCustomerRoute,
  createCustomersBatchRoute,
  updateCustomerRoute,
  archiveCustomerRoute,
  getCustomerRoute,
  listCustomersRoute,
} from "./customers.routes";

export const customersController = new OpenAPIHono<AppEnv>();

customersController.openapi(createCustomerRoute, async (c) => {
  const handler = c.get("customers").create;
  const body = c.req.valid("json");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    ...body,
    environment_id: environmentId,
  });

  return c.json(result, 201);
});

customersController.openapi(createCustomersBatchRoute, async (c) => {
  const handler = c.get("customers").createBatch;
  const body = c.req.valid("json");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    ...body,
    environment_id: environmentId,
  });

  return c.json(result, 201);
});

customersController.openapi(updateCustomerRoute, async (c) => {
  const handler = c.get("customers").update;
  const body = c.req.valid("json");
  const { id } = c.req.valid("param");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    ...body,
    id,
    environment_id: environmentId,
  });

  return c.json(result, 200);
});

customersController.openapi(archiveCustomerRoute, async (c) => {
  const handler = c.get("customers").archive;
  const { id } = c.req.valid("param");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    id,
    environment_id: environmentId,
  });

  return c.json(result, 200);
});

customersController.openapi(getCustomerRoute, async (c) => {
  const handler = c.get("customers").get;
  const { id } = c.req.valid("param");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    id,
    environment_id: environmentId,
  });

  return c.json(result, 200);
});

customersController.openapi(listCustomersRoute, async (c) => {
  const handler = c.get("customers").list;
  const query = c.req.valid("query");
  const environmentId = c.get("environmentId");

  const result = await handler.execute({
    ...query,
    environment_id: environmentId,
  });

  return c.json(result, 200);
});
