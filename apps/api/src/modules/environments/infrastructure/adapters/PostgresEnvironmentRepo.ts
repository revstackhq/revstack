import { eq } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { EnvironmentRepository } from "@/modules/environments/application/ports/EnvironmentRepository";
import { EnvironmentEntity } from "@/modules/environments/domain/EnvironmentEntity";
import { environments } from "@revstackhq/db";

type EnvironmentInsert = typeof environments.$inferInsert;
type EnvironmentSelect = typeof environments.$inferSelect;

export class PostgresEnvironmentRepository
  extends BasePostgresRepository<
    EnvironmentEntity,
    EnvironmentInsert,
    EnvironmentSelect
  >
  implements EnvironmentRepository
{
  constructor(db: PgDatabase<any, any, any>) {
    super(db, environments, {
      id: environments.id,
    });
  }

  protected toDomain(row: EnvironmentSelect): EnvironmentEntity {
    return EnvironmentEntity.restore({
      id: row.id,
      projectId: row.projectId,
      name: row.name,
      slug: row.slug,
      isDefault: row.isDefault,
      createdAt: row.createdAt,
    });
  }

  protected toPersistence(entity: EnvironmentEntity): EnvironmentInsert {
    return {
      id: entity.val.id,
      projectId: entity.val.projectId,
      name: entity.val.name,
      slug: entity.val.slug,
      isDefault: entity.val.isDefault,
      createdAt: entity.val.createdAt,
    };
  }

  async findByProjectId(projectId: string): Promise<EnvironmentEntity[]> {
    const rows = await this.db
      .select()
      .from(this.table)
      .where(eq(environments.projectId, projectId));

    return rows.map((row) => this.toDomain(row as EnvironmentSelect));
  }

  async findAll(): Promise<EnvironmentEntity[]> {
    const rows = await this.db.select().from(this.table);
    return rows.map((row) => this.toDomain(row as EnvironmentSelect));
  }
}
