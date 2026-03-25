import { eq, and } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { AuthConfigRepository } from "@/modules/auth/application/ports/AuthConfigRepository";
import { AuthConfigEntity } from "@/modules/auth/domain/AuthConfigEntity";
import { authConfigs } from "@revstackhq/db";

type AuthConfigInsert = typeof authConfigs.$inferInsert;
type AuthConfigSelect = typeof authConfigs.$inferSelect;

export class PostgresAuthConfigRepo
  extends BasePostgresRepository<AuthConfigEntity, AuthConfigInsert, AuthConfigSelect>
  implements AuthConfigRepository
{
  constructor(db: PgDatabase<any, any, any>) {
    super(db, authConfigs);
  }

  protected toDomain(row: AuthConfigSelect): AuthConfigEntity {
    return AuthConfigEntity.restore({
      id: row.id,
      environmentId: row.environmentId,
      provider: row.provider as any,
      strategy: row.strategy as any,
      jwksUri: row.jwksUri ?? undefined,
      signingSecret: row.signingSecret ?? undefined,
      issuer: row.issuer ?? undefined,
      audience: row.audience ?? undefined,
      userIdClaim: row.userIdClaim,
      status: row.status as "active" | "archived",
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  protected toPersistence(entity: AuthConfigEntity): AuthConfigInsert {
    return {
      id: entity.id,
      environmentId: entity.environmentId,
      provider: entity.provider as any,
      strategy: entity.strategy as any,
      jwksUri: entity.jwksUri ?? null,
      signingSecret: entity.signingSecret ?? null,
      issuer: entity.issuer ?? null,
      audience: entity.audience ?? null,
      userIdClaim: entity.userIdClaim,
      status: entity.status as any,
    };
  }

  async findByEnvironmentId(environmentId: string, status?: string): Promise<AuthConfigEntity[]> {
    const conditions = [eq(authConfigs.environmentId, environmentId)];
    if (status) conditions.push(eq(authConfigs.status, status as any));

    const rows = await this.db
      .select()
      .from(this.table)
      .where(and(...conditions));

    return rows.map((row) => this.toDomain(row as AuthConfigSelect));
  }
}
