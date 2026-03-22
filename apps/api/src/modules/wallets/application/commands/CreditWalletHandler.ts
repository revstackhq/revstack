import type { IWalletRepository } from "@/modules/wallets/application/ports/IWalletRepository";
import type { IEventBus } from "@/modules/wallets/application/ports/IEventBus";
import type { CreditWalletCommand } from "@/modules/wallets/application/commands/CreditWalletCommand";
import { WalletCreditedEvent } from "@/modules/wallets/domain/events/WalletCreditedEvent";
import { WalletNotFoundError } from "@/modules/wallets/domain/WalletErrors";

export class CreditWalletHandler {
  constructor(
    private readonly repository: IWalletRepository,
    private readonly eventBus: IEventBus
  ) {}

  public async handle(command: CreditWalletCommand): Promise<string> {
    const wallet = await this.repository.findByCustomerId(command.customerId);
    if (!wallet) {
      throw new WalletNotFoundError(command.customerId);
    }

    wallet.credit(command.amount);

    await this.repository.save(wallet);
    await this.eventBus.publish(new WalletCreditedEvent(wallet.id, command.customerId, command.amount));

    return wallet.id;
  }
}
