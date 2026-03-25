import type { IWalletRepository } from "@/modules/wallets/application/ports/IWalletRepository";
import type { ICacheService } from "@/common/application/ports/ICacheService";
import type { GetWalletBalanceQuery } from "@/modules/wallets/application/queries/GetWalletBalanceQuery";
import { WalletNotFoundError } from "@/modules/wallets/domain/WalletErrors";

export class GetWalletBalanceHandler {
  constructor(
    private readonly repository: IWalletRepository,
    private readonly cache: ICacheService
  ) {}

  public async handle(query: GetWalletBalanceQuery): Promise<any> {
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
