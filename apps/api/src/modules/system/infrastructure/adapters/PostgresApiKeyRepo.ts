import type { IApiKeyRepository } from "@/modules/system/application/ports/IApiKeyRepository";
import type { ApiKeyEntity } from "@/modules/system/domain/ApiKeyEntity";

export class PostgresApiKeyRepo implements IApiKeyRepository {
  constructor(private readonly db: any) {}

  async save(apiKey: ApiKeyEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findByHash(hash: string): Promise<ApiKeyEntity | null> {
    throw new Error("Method not implemented.");
  }

  async findByTenantId(tenantId: string): Promise<ApiKeyEntity[]> {
    throw new Error("Method not implemented.");
  }
}
