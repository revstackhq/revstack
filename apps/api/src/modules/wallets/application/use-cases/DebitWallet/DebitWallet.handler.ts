import type { WalletRepository } from "@/modules/wallets/application/ports/WalletRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { DebitWalletCommand } from "./DebitWallet.schema";
import { WalletTransactionEntity } from "@/modules/wallets/domain/WalletTransactionEntity";
import { NotFoundError } from "@/common/errors/DomainError";

export class DebitWalletHandler {
  constructor(
    private readonly repository: WalletRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: DebitWalletCommand) {
    const wallet = await this.repository.findById(command.walletId);
    if (!wallet) {
      throw new NotFoundError("Wallet not found", "WALLET_NOT_FOUND");
    }

    wallet.debit(command.amount);

    const transaction = WalletTransactionEntity.create(
      wallet.id,
      command.amount,
      "debit",
      command.referenceId
    );

    await this.repository.save(wallet); // Usually done via Unit of Work transaction in infrastructure
    await this.repository.saveTransaction(transaction);

    await this.eventBus.publish({ eventName: "wallet.debited", walletId: wallet.id, transactionId: transaction.id });

    return { success: true, balance: wallet.balance, transactionId: transaction.id };
  }
}
