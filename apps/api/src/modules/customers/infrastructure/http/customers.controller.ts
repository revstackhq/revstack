import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createCustomerSchema } from "@/modules/customers/application/commands/CreateCustomerCommand";
import type { AppEnv } from "@/container";

export const customersController = new Hono<AppEnv>();

customersController.post(
  "/",
  zValidator("json", createCustomerSchema),
  async (c) => {
    const handler = c.get("createCustomerHandler");
    const dto = c.req.valid("json");

    // Command
    const id = await handler.handle(dto);

    return c.json({ id, success: true }, 201);
  },
);

customersController.get("/", async (c) => {
  const handler = c.get("listCustomersHandler");

  const environmentId = c.req.param("environmentId");

  if (!environmentId) {
    return c.json({ error: "Environment ID is required" }, 400);
  }

  const result = await handler.handle({ environmentId });

  return c.json(result, 200);
});
