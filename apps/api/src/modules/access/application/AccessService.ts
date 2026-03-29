import { hashString } from "@/common/utils/crypto";
import { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";

export class AccessService {
  constructor(private readonly apiKeyRepo: ApiKeyRepository) {}

  async validateSecretApiKey(incomingRawKey: string) {
    const incomingHash = await hashString(incomingRawKey);

    const apiKey = await this.apiKeyRepo.findByHash(incomingHash);

    if (!apiKey || apiKey.val.type !== "secret") {
      return null;
    }

    return {
      environmentId: apiKey.val.environmentId,
      scopes: apiKey.val.scopes,
    };
  }
}
