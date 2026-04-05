import { z } from "zod";
import type { WalletRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { WalletCreditedEvent } from "@revstackhq/core";
import { WalletNotFoundError } from "@revstackhq/core";
import { WalletTransactionEntity } from "@revstackhq/core";

export const creditWalletSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  referenceId: z.string().optional(),
});

export type CreditWalletCommand = {
  walletId: string;
} & z.infer<typeof creditWalletSchema>;

export class CreditWalletHandler {
  constructor(
    private readonly repository: WalletRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: CreditWalletCommand) {
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
