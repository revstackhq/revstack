import { eq, and } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { AuthConfigRepository } from "@revstackhq/core";
import { AuthConfigEntity } from "@revstackhq/core";
import { authConfigs } from "@revstackhq/db";

type AuthConfigInsert = typeof authConfigs.$inferInsert;
type AuthConfigSelect = typeof authConfigs.$inferSelect;

export class PostgresAuthConfigRepository
  extends BasePostgresRepository<AuthConfigEntity, AuthConfigInsert, AuthConfigSelect>
  implements AuthConfigRepository
{
  constructor(db: PgDatabase<any, any, any>) {
    super(db, authConfigs, {
      id: authConfigs.id,
      environmentId: authConfigs.environmentId,
    });
  }

  protected toDomain(row: AuthConfigSelect): AuthConfigEntity {
    return AuthConfigEntity.restore({
      id: row.id,
      environment_id: row.environmentId,
      provider: row.provider,
      strategy: row.strategy,
      jwks_uri: row.jwksUri ?? undefined,
      signing_secret: row.signingSecret ?? undefined,
      issuer: row.issuer ?? undefined,
      audience: row.audience ?? undefined,
      user_id_claim: row.userIdClaim,
      status: row.status,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
    });
  }

  protected toPersistence(entity: AuthConfigEntity): AuthConfigInsert {
    return {
      id: entity.val.id,
      environmentId: entity.val.environment_id,
      provider: entity.val.provider,
      strategy: entity.val.strategy,
      jwksUri: entity.val.jwks_uri ?? null,
      signingSecret: entity.val.signing_secret ?? null,
      issuer: entity.val.issuer ?? null,
      audience: entity.val.audience ?? null,
      userIdClaim: entity.val.user_id_claim,
      status: entity.val.status,
    };
  }

  async findByEnvironmentId(
    environmentId: string,
    status?: string,
  ): Promise<AuthConfigEntity[]> {
    const conditions = [eq(authConfigs.environmentId, environmentId)];
    if (status)
      conditions.push(
        eq(
          authConfigs.status,
          status as "active" | "inactive" | "archived" | "draft",
        ),
      );

    const rows = await this.db
      .select()
      .from(this.table)
      .where(and(...conditions));

    return rows.map((row) => this.toDomain(row as AuthConfigSelect));
  }
}
