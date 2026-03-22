import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { creditWalletSchema } from "@/modules/wallets/application/commands/CreditWalletCommand";
import type { AppEnv } from "@/container";

export const walletsController = new Hono<AppEnv>();

walletsController.post(
  "/credit",
  zValidator("json", creditWalletSchema),
  async (c) => {
    const handler = c.get("creditWalletHandler");
    const dto = c.req.valid("json");
    
    // Command
    const id = await handler.handle(dto);
    
    return c.json({ id, success: true }, 200);
  }
);

walletsController.get("/:customerId/balance", async (c) => {
  const handler = c.get("getWalletBalanceHandler");
  const customerId = c.req.param("customerId");
  
  // Fast-path Query
  const result = await handler.handle({ customerId });
  
  return c.json(result, 200);
});
