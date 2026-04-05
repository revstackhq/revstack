import { eq } from "drizzle-orm";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { WorkspaceMemberRepository } from "@revstackhq/core";
import { WorkspaceMemberEntity } from "@revstackhq/core";
import { DrizzleDB, workspaceMembers } from "@revstackhq/db";

type WorkspaceMemberInsert = typeof workspaceMembers.$inferInsert;
type WorkspaceMemberSelect = typeof workspaceMembers.$inferSelect;

export class PostgresWorkspaceMemberRepository
  extends BasePostgresRepository<
    WorkspaceMemberEntity,
    WorkspaceMemberInsert,
    WorkspaceMemberSelect
  >
  implements WorkspaceMemberRepository
{
  constructor(db: DrizzleDB) {
    super(db, workspaceMembers, {
      id: workspaceMembers.id,
      environmentId: workspaceMembers.environmentId,
    });
  }

  protected toDomain(row: WorkspaceMemberSelect): WorkspaceMemberEntity {
    return WorkspaceMemberEntity.restore({
      id: row.id,
      email: row.email,
      passwordHash: row.passwordHash,
      name: row.name ?? undefined,
      role: row.role,
      environmentId: row.environmentId,
      isActive: true,
      createdAt: row.createdAt,
    });
  }

  protected toPersistence(
    entity: WorkspaceMemberEntity,
  ): WorkspaceMemberInsert {
    return {
      id: entity.val.id,
      email: entity.val.email,
      passwordHash: entity.val.passwordHash,
      name: entity.val.name ?? null,
      role: entity.val.role,
      environmentId: entity.val.environmentId,
    };
  }

  async findByEmail(email: string): Promise<WorkspaceMemberEntity | null> {
    const rows = await this.db
      .select()
      .from(this.table)
      .where(eq(workspaceMembers.email, email));

    const row = rows[0];
    return row ? this.toDomain(row as WorkspaceMemberSelect) : null;
  }

  async findAll(): Promise<WorkspaceMemberEntity[]> {
    const rows = await this.db.select().from(this.table);
    return rows.map((row) => this.toDomain(row as WorkspaceMemberSelect));
  }
}
