import type { WalletRepository } from "@/modules/wallets/application/ports/WalletRepository";
import type { ListWalletTransactionsQuery } from "@/modules/wallets/application/queries/ListWalletTransactionsQuery";
import { NotFoundError } from "@/common/errors/DomainError";

export class ListWalletTransactionsHandler {
  constructor(private readonly repository: WalletRepository) {}

  public async handle(query: ListWalletTransactionsQuery) {
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
