import { eq, and } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import { apiKeys } from "@revstackhq/db";
import { ApiKeyEntity } from "@/modules/system/domain/ApiKeyEntity";

type ApiKeyInsert = typeof apiKeys.$inferInsert;
type ApiKeySelect = typeof apiKeys.$inferSelect;

export class PostgresApiKeyRepository extends BasePostgresRepository<
  ApiKeyEntity,
  ApiKeyInsert,
  ApiKeySelect
> {
  constructor(db: PgDatabase<any, any, any>) {
    super(db, apiKeys, {
      id: apiKeys.key,
      environmentId: apiKeys.environmentId,
    });
  }

  protected toDomain(row: ApiKeySelect): ApiKeyEntity {
    return ApiKeyEntity.restore({
      keyHash: row.key,
      name: row.name,
      scopes: row.scopes as string[],
      environmentId: row.environmentId,
      type: row.type as "public" | "secret",
      displayKey: `${row.type === "public" ? "rv_pk" : "rv_sk"}_***${row.key.slice(-4)}`,
      createdAt: row.createdAt,
    });
  }

  protected toPersistence(entity: ApiKeyEntity): ApiKeyInsert {
    return {
      key: entity.val.keyHash,
      name: entity.val.name,
      scopes: entity.val.scopes,
      environmentId: entity.val.environmentId,
      type: entity.val.type,
      createdAt: entity.val.createdAt,
    };
  }

  async findByHash(hash: string): Promise<ApiKeyEntity | null> {
    const [row] = await this.db
      .select()
      .from(this.table)
      .where(eq(apiKeys.key, hash));

    return row ? this.toDomain(row as ApiKeySelect) : null;
  }

  async findByEnvironment(environmentId: string): Promise<ApiKeyEntity[]> {
    const rows = await this.db
      .select()
      .from(this.table)
      .where(eq(apiKeys.environmentId, environmentId));

    return rows.map((row) => this.toDomain(row as ApiKeySelect));
  }
}
