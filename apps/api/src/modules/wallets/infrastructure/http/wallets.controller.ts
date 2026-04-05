import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "@/container";
import {
  creditWalletRoute,
  debitWalletRoute,
  getBalanceRoute,
  listTransactionsRoute,
} from "@/modules/wallets/infrastructure/http/wallets.routes";

export const walletsController = new OpenAPIHono<AppEnv>();


walletsController.openapi(creditWalletRoute, async (c) => {
  const handler = c.get("wallets").credit;
  const { walletId } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ walletId, ...dto });
  return c.json(result, 201);
});

walletsController.openapi(debitWalletRoute, async (c) => {
  const handler = c.get("wallets").debit;
  const { walletId } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ walletId, ...dto });
  return c.json(result, 201);
});

walletsController.openapi(getBalanceRoute, async (c) => {
  const handler = c.get("wallets").getBalance;
  const { customerId } = c.req.valid("param");
  const result = await handler.execute({ customerId });
  return c.json(result, 200);
});

walletsController.openapi(listTransactionsRoute, async (c) => {
  const handler = c.get("wallets").listTransactions;
  const { walletId } = c.req.valid("param");
  const result = await handler.execute({ walletId });
  return c.json(result, 200);
});
