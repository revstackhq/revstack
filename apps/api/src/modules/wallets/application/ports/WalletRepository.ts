import type { WalletEntity } from "@/modules/wallets/domain/WalletEntity";
import type { WalletTransactionEntity } from "@/modules/wallets/domain/WalletTransactionEntity";

export interface WalletRepository {
  save(wallet: WalletEntity): Promise<void>;
  findByCustomerId(customerId: string): Promise<WalletEntity | null>;
  findById(id: string): Promise<WalletEntity | null>;
  
  saveTransaction(transaction: WalletTransactionEntity): Promise<void>;
  findTransactionsByWalletId(walletId: string): Promise<WalletTransactionEntity[]>;
}
