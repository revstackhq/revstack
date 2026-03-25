import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createPriceSchema } from "@/modules/prices/application/commands/CreatePriceCommand";
import { updatePriceSchema } from "@/modules/prices/application/commands/UpdatePriceCommand";
import { versionPriceSchema } from "@/modules/prices/application/commands/VersionPriceCommand";
import { listPricesSchema } from "@/modules/prices/application/queries/ListPricesQuery";
import type { AppEnv } from "@/container";

export const pricesController = new Hono<AppEnv>();

pricesController.post(
  "/",
  zValidator("json", createPriceSchema),
  async (c) => {
    const handler = c.get("prices").create;
    const dto = c.req.valid("json");
    const result = await handler.handle(dto);
    return c.json(result, 201);
  }
);

pricesController.patch(
  "/:id",
  zValidator("json", updatePriceSchema),
  async (c) => {
    const handler = c.get("prices").update;
    const dto = c.req.valid("json");
    const result = await handler.handle({ priceId: c.req.param("id"), ...dto });
    return c.json(result, 200);
  }
);

pricesController.post(
  "/:id/version",
  zValidator("json", versionPriceSchema),
  async (c) => {
    const handler = c.get("prices").version;
    const dto = c.req.valid("json");
    const result = await handler.handle({ priceId: c.req.param("id"), ...dto });
    return c.json(result, 201);
  }
);

pricesController.get(
  "/",
  zValidator("query", listPricesSchema),
  async (c) => {
    const handler = c.get("prices").list;
    const query = c.req.valid("query");
    const result = await handler.handle(query);
    return c.json(result, 200);
  }
);

pricesController.get("/:id", async (c) => {
  const handler = c.get("prices").get;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});
