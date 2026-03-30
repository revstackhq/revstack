import type { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";
import type { GetApiKeyQuery } from "./GetApiKey.schema";
import { ApiKeyNotFoundError } from "@/modules/system/domain/SystemErrors";

export class GetApiKeyHandler {
  constructor(private readonly repository: ApiKeyRepository) {}

  public async execute(query: GetApiKeyQuery) {
    const key = await this.repository.findById(query.keyId);
    if (!key) {
      throw new ApiKeyNotFoundError();
    }
    return key.val;
  }
}
