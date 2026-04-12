import { PaginatedCursorResult } from "@/types";
import { ApiKeyEntity, ApiKeyStatus, ApiKeyType } from "./ApiKeyEntity";

export interface ApiKeyRepository {
  save(apiKey: ApiKeyEntity): Promise<void>;

  findByHash(params: {
    keyHash: string;
    environmentId: string;
  }): Promise<ApiKeyEntity | null>;

  list(params: {
    environmentId: string;
    type?: ApiKeyType;
    status?: ApiKeyStatus;
    limit?: number;
    cursor?: string;
  }): Promise<PaginatedCursorResult<ApiKeyEntity>>;
}
