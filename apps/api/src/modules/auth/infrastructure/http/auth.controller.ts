import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { putAuthConfigSchema } from "@/modules/auth/application/commands/PutAuthConfigCommand";
import { listAuthConfigsSchema } from "@/modules/auth/application/queries/ListAuthConfigsQuery";
import type { AppEnv } from "@/container";

export const authController = new Hono<AppEnv>();

authController.put(
  "/",
  zValidator("json", putAuthConfigSchema),
  async (c) => {
    const handler = c.get("auth").putConfig;
    const dto = c.req.valid("json");
    const result = await handler.handle(dto);
    return c.json(result, 200);
  }
);

authController.get("/", zValidator("query", listAuthConfigsSchema), async (c) => {
  const handler = c.get("auth").listConfigs;
  const query = c.req.valid("query");
  const result = await handler.handle(query);
  return c.json(result, 200);
});

authController.get("/:id", async (c) => {
  const handler = c.get("auth").getConfig;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});
