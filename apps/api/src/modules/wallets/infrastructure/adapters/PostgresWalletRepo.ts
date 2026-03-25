import type { WalletRepository } from "@/modules/wallets/application/ports/WalletRepository";
import type { WalletEntity } from "@/modules/wallets/domain/WalletEntity";
import type { WalletTransactionEntity } from "@/modules/wallets/domain/WalletTransactionEntity";

export class PostgresWalletRepo implements WalletRepository {
  constructor(private readonly db: any) {}

  async save(wallet: WalletEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async findByCustomerId(
    customerId: string,
  ): Promise<WalletEntity | null> {
    // Scaffolded implementation
    return null;
  }

  public async findById(id: string): Promise<WalletEntity | null> {
    // Scaffolded implementation
    return null;
  }

  public async saveTransaction(
    transaction: WalletTransactionEntity,
  ): Promise<void> {
    // Scaffolded implementation
  }

  public async findTransactionsByWalletId(
    walletId: string,
  ): Promise<WalletTransactionEntity[]> {
    // Scaffolded implementation
    return [];
  }
}
