import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { creditWalletSchema } from "@/modules/wallets/application/commands/CreditWalletCommand";
import { debitWalletSchema } from "@/modules/wallets/application/commands/DebitWalletCommand";
import { listWalletTransactionsSchema } from "@/modules/wallets/application/queries/ListWalletTransactionsQuery";
import type { AppEnv } from "@/container";

export const walletsController = new Hono<AppEnv>();

walletsController.post(
  "/:id/credit",
  zValidator("json", creditWalletSchema),
  async (c) => {
    const handler = c.get("wallets").credit;
    const dto = c.req.valid("json");
    const result = await handler.handle({ walletId: c.req.param("id"), ...dto });
    return c.json(result, 201);
  }
);

walletsController.post(
  "/:id/debit",
  zValidator("json", debitWalletSchema),
  async (c) => {
    const handler = c.get("wallets").debit;
    const dto = c.req.valid("json");
    const result = await handler.handle({ walletId: c.req.param("id"), ...dto });
    return c.json(result, 201);
  }
);

walletsController.get("/:id", async (c) => {
  const handler = c.get("wallets").getBalance;
  const result = await handler.handle({ customerId: c.req.param("id") }); // Usually customerId or walletId depending on current system
  return c.json(result, 200);
});

walletsController.get(
  "/:id/transactions",
  zValidator("query", listWalletTransactionsSchema),
  async (c) => {
    const handler = c.get("wallets").listTransactions;
    const query = c.req.valid("query");
    const result = await handler.handle({ walletId: c.req.param("id"), ...query });
    return c.json(result, 200);
  }
);
