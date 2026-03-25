import type { ApiKeyRepository } from "@/modules/system/application/ports/ApiKeyRepository";
import type { ApiKeyEntity } from "@/modules/system/domain/ApiKeyEntity";

export class PostgresApiKeyRepo implements ApiKeyRepository {
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

  async findById(id: string): Promise<ApiKeyEntity | null> {
    throw new Error("Method not implemented.");
  }

  async findByEnvironmentId(environmentId: string, type?: string): Promise<ApiKeyEntity[]> {
    throw new Error("Method not implemented.");
  }

  async delete(hash: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
