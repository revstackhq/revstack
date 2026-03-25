import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createCustomerSchema } from "@/modules/customers/application/commands/CreateCustomerCommand";
import { createManyCustomersSchema } from "@/modules/customers/application/commands/CreateManyCustomersCommand";
import type { AppEnv } from "@/container";

export const customersController = new Hono<AppEnv>();

customersController.post(
  "/",
  zValidator("json", createCustomerSchema),
  async (c) => {
    const handler = c.get("customers").create;
    const dto = c.req.valid("json");

    // Command
    const id = await handler.handle(dto);

    return c.json({ id, success: true }, 201);
  },
);

customersController.get("/", async (c) => {
  const handler = c.get("customers").list;

  const environmentId = c.req.param("environmentId");

  if (!environmentId) {
    return c.json({ error: "Environment ID is required" }, 400);
  }

  const result = await handler.handle({ environmentId });

  return c.json(result, 200);
});

customersController.post(
  "/bulk",
  zValidator("json", createManyCustomersSchema),
  async (c) => {
    const handler = c.get("customers").createMany;
    const dto = c.req.valid("json");
    const result = await handler.handle(dto);
    return c.json(result, 201);
  }
);

customersController.delete("/:id", async (c) => {
  const handler = c.get("customers").delete;
  await handler.handle({ id: c.req.param("id") });
  return c.json({ success: true, message: "Customer deleted successfully" }, 200);
});
