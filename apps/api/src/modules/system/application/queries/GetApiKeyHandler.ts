import type { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";
import type { GetApiKeyQuery } from "@/modules/system/application/queries/GetApiKeyQuery";
import { ApiKeyNotFoundError } from "@/modules/system/domain/SystemErrors";

export class GetApiKeyHandler {
  constructor(private readonly repository: ApiKeyRepository) {}

  public async handle(query: GetApiKeyQuery) {
    const key = await this.repository.findById(query.keyId);
    if (!key) {
      throw new ApiKeyNotFoundError();
    }
    return key.toPrimitives();
  }
}
