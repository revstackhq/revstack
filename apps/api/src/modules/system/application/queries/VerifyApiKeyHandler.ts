import type { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";
import type { CacheService } from "@/common/application/ports/CacheService";
import type { VerifyApiKeyQuery } from "@/modules/system/application/queries/VerifyApiKeyQuery";
import { ApiKeyNotFoundError } from "@/modules/system/domain/SystemErrors";

export class VerifyApiKeyHandler {
  constructor(
    private readonly repository: ApiKeyRepository,
    private readonly cache: CacheService
  ) {}

  public async handle(query: VerifyApiKeyQuery): Promise<{ environmentId: string, isValid: boolean }> {
    // In actual implementation, we hash the generic apiKey provided to matching `keyHash`
    const hashedKey = "hashed_" + query.apiKey;
    
    const cacheKey = `apikey_${hashedKey}`;
    const cached = await this.cache.get<{ environmentId: string, isValid: boolean }>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const keyEntity = await this.repository.findByHash(hashedKey);
    
    if (!keyEntity || !keyEntity.isActive) {
      throw new ApiKeyNotFoundError();
    }

    const result = { environmentId: keyEntity.environmentId, isValid: true };
    await this.cache.set(cacheKey, result, 300); // Cache auth checks for 5 mins

    return result;
  }
}
