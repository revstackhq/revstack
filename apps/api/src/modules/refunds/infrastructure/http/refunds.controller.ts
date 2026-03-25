import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createRefundSchema } from "@/modules/refunds/application/commands/CreateRefundCommand";
import { updateRefundSchema } from "@/modules/refunds/application/commands/UpdateRefundCommand";
import { listRefundsSchema } from "@/modules/refunds/application/queries/ListRefundsQuery";
import type { AppEnv } from "@/container";

export const refundsController = new Hono<AppEnv>();

refundsController.post(
  "/payments/:paymentId/refunds",
  zValidator("json", createRefundSchema),
  async (c) => {
    const handler = c.get("refunds").create;
    const dto = c.req.valid("json");
    const result = await handler.handle({ paymentId: c.req.param("paymentId"), ...dto });
    return c.json(result, 201);
  }
);

refundsController.patch(
  "/:id",
  zValidator("json", updateRefundSchema),
  async (c) => {
    const handler = c.get("refunds").update;
    const dto = c.req.valid("json");
    const result = await handler.handle({ id: c.req.param("id"), ...dto });
    return c.json(result, 200);
  }
);

refundsController.get(
  "/",
  zValidator("query", listRefundsSchema),
  async (c) => {
    const handler = c.get("refunds").list;
    const query = c.req.valid("query");
    const result = await handler.handle(query);
    return c.json(result, 200);
  }
);

refundsController.get("/:id", async (c) => {
  const handler = c.get("refunds").get;
  const result = await handler.handle({ id: c.req.param("id") });
  return c.json(result, 200);
});
