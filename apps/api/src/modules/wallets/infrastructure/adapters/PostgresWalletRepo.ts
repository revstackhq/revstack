import type { IWalletRepository } from "@/modules/wallets/application/ports/IWalletRepository";
import type { WalletEntity } from "@/modules/wallets/domain/WalletEntity";

export class PostgresWalletRepo implements IWalletRepository {
  constructor(private readonly db: any) {}

  async save(wallet: WalletEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findByCustomerId(customerId: string): Promise<WalletEntity | null> {
    throw new Error("Method not implemented.");
  }
}
