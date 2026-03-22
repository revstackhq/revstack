import type { ApiKeyEntity } from "@/modules/system/domain/ApiKeyEntity";

export interface IApiKeyRepository {
  save(apiKey: ApiKeyEntity): Promise<void>;
  findByHash(hash: string): Promise<ApiKeyEntity | null>;
  findByTenantId(tenantId: string): Promise<ApiKeyEntity[]>;
}
