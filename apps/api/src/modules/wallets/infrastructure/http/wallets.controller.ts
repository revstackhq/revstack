import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { creditWalletSchema } from "@/modules/wallets/application/use-cases/CreditWallet/CreditWallet.schema";
import { debitWalletSchema } from "@/modules/wallets/application/use-cases/DebitWallet/DebitWallet.schema";
import type { AppEnv } from "@/container";

export const walletsController = new OpenAPIHono<AppEnv>();

const creditWalletRoute = createRoute({
  method: "post",
  path: "/{walletId}/credit",
  tags: ["Wallets"],
  summary: "Credit a wallet",
  description:
    "Adds funds to a customer wallet. Creates an ACID-compliant transaction record.",
  request: {
    params: z.object({ walletId: z.string().openapi({ example: "wal_abc123" }) }),
    body: { content: { "application/json": { schema: creditWalletSchema } } },
  },
  responses: {
    201: {
      description: "Wallet credited",
      content: { "application/json": { schema: z.any() } },
    },
    400: { description: "Validation error" },
  },
});

walletsController.openapi(creditWalletRoute, async (c) => {
  const handler = c.get("wallets").credit;
  const { walletId } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ walletId, ...dto });
  return c.json(result, 201);
});

const debitWalletRoute = createRoute({
  method: "post",
  path: "/{walletId}/debit",
  tags: ["Wallets"],
  summary: "Debit a wallet",
  description:
    "Withdraws funds from a customer wallet. Fails if insufficient balance.",
  request: {
    params: z.object({ walletId: z.string().openapi({ example: "wal_abc123" }) }),
    body: { content: { "application/json": { schema: debitWalletSchema } } },
  },
  responses: {
    201: {
      description: "Wallet debited",
      content: { "application/json": { schema: z.any() } },
    },
    400: { description: "Insufficient balance or validation error" },
  },
});

walletsController.openapi(debitWalletRoute, async (c) => {
  const handler = c.get("wallets").debit;
  const { walletId } = c.req.valid("param");
  const dto = c.req.valid("json");
  const result = await handler.execute({ walletId, ...dto });
  return c.json(result, 201);
});

const getBalanceRoute = createRoute({
  method: "get",
  path: "/{customerId}/balance",
  tags: ["Wallets"],
  summary: "Get wallet balance",
  description: "Retrieves the current balance of a customer wallet.",
  request: {
    params: z.object({ customerId: z.string().openapi({ example: "cust_abc123" }) }),
  },
  responses: {
    200: {
      description: "Wallet balance",
      content: { "application/json": { schema: z.any() } },
    },
  },
});

walletsController.openapi(getBalanceRoute, async (c) => {
  const handler = c.get("wallets").getBalance;
  const { customerId } = c.req.valid("param");
  const result = await handler.execute({ customerId });
  return c.json(result, 200);
});

const listTransactionsRoute = createRoute({
  method: "get",
  path: "/{walletId}/transactions",
  tags: ["Wallets"],
  summary: "List wallet transactions",
  description: "Retrieves the transaction history for a specific wallet.",
  request: {
    params: z.object({ walletId: z.string().openapi({ example: "wal_abc123" }) }),
  },
  responses: {
    200: {
      description: "Transaction history",
      content: { "application/json": { schema: z.array(z.any()) } },
    },
  },
});

walletsController.openapi(listTransactionsRoute, async (c) => {
  const handler = c.get("wallets").listTransactions;
  const { walletId } = c.req.valid("param");
  const result = await handler.execute({ walletId });
  return c.json(result, 200);
});
