import type { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";
import type { ListApiKeysQuery } from "./ListApiKeys.schema";

export class ListApiKeysHandler {
  constructor(private readonly repository: ApiKeyRepository) {}

  public async execute(query: ListApiKeysQuery) {
    const keys = await this.repository.findByEnvironmentId(query.environmentId, query.type);
    return keys.map(k => k.val);
  }
}
