import type { ApiKeyRepository } from "@revstackhq/core";
import { ApiKeyNotFoundError } from "@revstackhq/core";

export interface GetApiKeyQuery {
  keyId: string;
}

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
