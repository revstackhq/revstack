import { eq, and } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { AuthConfigRepository } from "@/modules/auth/application/ports/AuthConfigRepository";
import { AuthConfigEntity } from "@/modules/auth/domain/AuthConfigEntity";
import { authConfigs } from "@revstackhq/db";

type AuthConfigInsert = typeof authConfigs.$inferInsert;
type AuthConfigSelect = typeof authConfigs.$inferSelect;

export class PostgresAuthConfigRepo
  extends BasePostgresRepository<
    AuthConfigEntity,
    AuthConfigInsert,
    AuthConfigSelect
  >
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
      environmentId: row.environmentId,
      provider: row.provider,
      strategy: row.strategy,
      jwksUri: row.jwksUri ?? undefined,
      signingSecret: row.signingSecret ?? undefined,
      issuer: row.issuer ?? undefined,
      audience: row.audience ?? undefined,
      userIdClaim: row.userIdClaim,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  protected toPersistence(entity: AuthConfigEntity): AuthConfigInsert {
    return {
      id: entity.val.id,
      environmentId: entity.val.environmentId,
      provider: entity.val.provider,
      strategy: entity.val.strategy,
      jwksUri: entity.val.jwksUri ?? null,
      signingSecret: entity.val.signingSecret ?? null,
      issuer: entity.val.issuer ?? null,
      audience: entity.val.audience ?? null,
      userIdClaim: entity.val.userIdClaim,
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
