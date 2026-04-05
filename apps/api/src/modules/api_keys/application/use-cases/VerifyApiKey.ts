import type { ApiKeyRepository } from "@revstackhq/core";
import type { CacheService } from "@/common/application/ports/CacheService";
import { ApiKeyNotFoundError } from "@revstackhq/core";

export interface VerifyApiKeyQuery {
  apiKey: string;
}

export class VerifyApiKeyHandler {
  constructor(
    private readonly repository: ApiKeyRepository,
    private readonly cache: CacheService
  ) {}

  public async execute(query: VerifyApiKeyQuery): Promise<{ environmentId: string, isValid: boolean }> {
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
