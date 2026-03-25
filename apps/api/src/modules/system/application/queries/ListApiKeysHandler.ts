import type { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";
import type { ListApiKeysQuery } from "@/modules/system/application/queries/ListApiKeysQuery";

export class ListApiKeysHandler {
  constructor(private readonly repository: ApiKeyRepository) {}

  public async handle(query: ListApiKeysQuery) {
    const keys = await this.repository.findByEnvironmentId(query.environmentId, query.type);
    return keys.map(k => k.toPrimitives());
  }
}
