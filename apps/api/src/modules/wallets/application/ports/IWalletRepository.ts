import type { WalletEntity } from "@/modules/wallets/domain/WalletEntity";

export interface IWalletRepository {
  save(wallet: WalletEntity): Promise<void>;
  findByCustomerId(customerId: string): Promise<WalletEntity | null>;
}
