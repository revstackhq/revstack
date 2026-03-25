import type { WalletRepository } from "@/modules/wallets/application/ports/WalletRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreditWalletCommand } from "@/modules/wallets/application/commands/CreditWalletCommand";
import { WalletCreditedEvent } from "@/modules/wallets/domain/events/WalletCreditedEvent";
import { WalletNotFoundError } from "@/modules/wallets/domain/WalletErrors";
import { WalletTransactionEntity } from "@/modules/wallets/domain/WalletTransactionEntity";

export class CreditWalletHandler {
  constructor(
    private readonly repository: WalletRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: CreditWalletCommand) {
    const wallet = await this.repository.findById(command.walletId);
    if (!wallet) {
      throw new WalletNotFoundError(command.walletId);
    }

    wallet.credit(command.amount);

    const transaction = WalletTransactionEntity.create(
      wallet.id,
      command.amount,
      "credit",
      command.referenceId
    );

    await this.repository.save(wallet);
    await this.repository.saveTransaction(transaction);
    await this.eventBus.publish(new WalletCreditedEvent(wallet.id, wallet.customerId, command.amount));

    return { success: true, balance: wallet.balance, transactionId: transaction.id };
  }
}
