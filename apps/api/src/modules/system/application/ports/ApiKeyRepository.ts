import type { ApiKeyEntity } from "@/modules/system/domain/ApiKeyEntity";

export interface ApiKeyRepository {
  save(apiKey: ApiKeyEntity): Promise<string>;
  findById(id: string): Promise<ApiKeyEntity | null>;
  findByHash(hash: string): Promise<ApiKeyEntity | null>;
  findByEnvironment(
    environmentId: string,
    type?: "public" | "secret",
  ): Promise<ApiKeyEntity[]>;
  delete(id: string): Promise<boolean>;
}
