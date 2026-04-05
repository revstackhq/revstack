import { createRoute, z } from "@hono/zod-openapi";
import { creditWalletSchema } from "@/modules/wallets/application/use-cases/CreditWallet";
import { debitWalletSchema } from "@/modules/wallets/application/use-cases/DebitWallet";

export const creditWalletRoute = createRoute({
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

export const debitWalletRoute = createRoute({
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

export const getBalanceRoute = createRoute({
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

export const listTransactionsRoute = createRoute({
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
