import { z } from "zod";

export const listWalletTransactionsSchema = z.object({
  status: z.enum(["completed", "failed", "pending"]).optional(),
  type: z.enum(["credit", "debit"]).optional(),
});

export type ListWalletTransactionsQuery = {
  walletId: string;
} & z.infer<typeof listWalletTransactionsSchema>;
