import type { WalletRepository } from "@/modules/wallets/application/ports/WalletRepository";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { GetWalletBalanceQuery } from "./GetWalletBalance.schema";
import { WalletNotFoundError } from "@/modules/wallets/domain/WalletErrors";

export class GetWalletBalanceHandler {
  constructor(
    private readonly repository: WalletRepository,
    private readonly cache: CacheService
  ) {}

  public async execute(query: GetWalletBalanceQuery): Promise<any> {
    const cacheKey = `wallet_balance_${query.customerId}`;
    const cached = await this.cache.get<any>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const wallet = await this.repository.findByCustomerId(query.customerId);
    
    if (!wallet) {
      throw new WalletNotFoundError(query.customerId);
    }

    await this.cache.set(cacheKey, wallet, 30);

    return wallet;
  }
}
