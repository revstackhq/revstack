import { z } from "zod";
import type { WalletRepository } from "@revstackhq/core";
import { NotFoundError } from "@revstackhq/core";

export const listWalletTransactionsSchema = z.object({
  status: z.enum(["completed", "failed", "pending"]).optional(),
  type: z.enum(["credit", "debit"]).optional(),
});

export type ListWalletTransactionsQuery = {
  walletId: string;
} & z.infer<typeof listWalletTransactionsSchema>;

export class ListWalletTransactionsHandler {
  constructor(private readonly repository: WalletRepository) {}

  public async execute(query: ListWalletTransactionsQuery) {
    const wallet = await this.repository.findById(query.walletId);
    if (!wallet) {
      throw new NotFoundError("Wallet not found", "WALLET_NOT_FOUND");
    }

    // Usually you would filter these via SQL in the infrastructure layer
    let transactions = await this.repository.findTransactionsByWalletId(query.walletId);

    if (query.type) {
      transactions = transactions.filter((tx) => tx.type === query.type);
    }
    if (query.status) {
      transactions = transactions.filter((tx) => tx.status === query.status);
    }

    return transactions;
  }
}
