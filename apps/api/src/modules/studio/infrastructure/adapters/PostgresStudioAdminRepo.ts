import { eq } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { StudioAdminRepository } from "@/modules/studio/application/ports/StudioAdminRepository";
import { StudioAdminEntity } from "@/modules/studio/domain/StudioAdminEntity";
import { studioAdmins } from "@revstackhq/db";

type StudioAdminInsert = typeof studioAdmins.$inferInsert;
type StudioAdminSelect = typeof studioAdmins.$inferSelect;

export class PostgresStudioAdminRepo
  extends BasePostgresRepository<StudioAdminEntity, StudioAdminInsert, StudioAdminSelect>
  implements StudioAdminRepository
{
  constructor(db: PgDatabase<any, any, any>) {
    super(db, studioAdmins);
  }

  protected toDomain(row: StudioAdminSelect): StudioAdminEntity {
    return StudioAdminEntity.restore({
      id: row.id,
      email: row.email,
      passwordHash: row.passwordHash,
      name: row.name ?? undefined,
      isSuperadmin: row.isSuperadmin,
      isActive: true,
      createdAt: row.createdAt,
    });
  }

  protected toPersistence(entity: StudioAdminEntity): StudioAdminInsert {
    return {
      id: entity.id,
      email: entity.email,
      passwordHash: entity.passwordHash,
      name: entity.name ?? null,
      isSuperadmin: entity.isSuperadmin,
    };
  }

  async findByEmail(email: string): Promise<StudioAdminEntity | null> {
    const rows = await this.db
      .select()
      .from(this.table)
      .where(eq(studioAdmins.email, email));

    const row = rows[0];
    return row ? this.toDomain(row as StudioAdminSelect) : null;
  }

  async findAll(): Promise<StudioAdminEntity[]> {
    const rows = await this.db.select().from(this.table);
    return rows.map((row) => this.toDomain(row as StudioAdminSelect));
  }
}
