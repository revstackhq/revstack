import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { EnvironmentRepository } from "@/modules/environments/application/ports/EnvironmentRepository";
import { EnvironmentEntity } from "@/modules/environments/domain/EnvironmentEntity";
import { environments } from "@revstackhq/db";

type EnvironmentInsert = typeof environments.$inferInsert;
type EnvironmentSelect = typeof environments.$inferSelect;

export class PostgresEnvironmentRepo
  extends BasePostgresRepository<EnvironmentEntity, EnvironmentInsert, EnvironmentSelect>
  implements EnvironmentRepository
{
  constructor(db: PgDatabase<any, any, any>) {
    super(db, environments);
  }

  protected toDomain(row: EnvironmentSelect): EnvironmentEntity {
    return EnvironmentEntity.restore({
      id: row.id,
      projectId: row.projectId || "",
      name: row.name,
      isDefault: false,
      type: "sandbox",
      createdAt: row.createdAt,
    });
  }

  protected toPersistence(entity: EnvironmentEntity): EnvironmentInsert {
    return {
      id: entity.id,
      projectId: entity.projectId || null,
      name: entity.name,
    };
  }

  async findAll(): Promise<EnvironmentEntity[]> {
    const rows = await this.db.select().from(this.table);
    return rows.map((row) => this.toDomain(row as EnvironmentSelect));
  }
}
