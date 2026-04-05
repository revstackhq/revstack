import type { WalletEntity } from "@/domain/aggregates/wallets/WalletEntity";
import type { WalletTransactionEntity } from "@/domain/aggregates/wallets/WalletTransactionEntity";

export interface WalletRepository {
  save(wallet: WalletEntity): Promise<void>;
  findByCustomerId(customerId: string): Promise<WalletEntity | null>;
  findById(id: string): Promise<WalletEntity | null>;
  
  saveTransaction(transaction: WalletTransactionEntity): Promise<void>;
  findTransactionsByWalletId(walletId: string): Promise<WalletTransactionEntity[]>;
}
