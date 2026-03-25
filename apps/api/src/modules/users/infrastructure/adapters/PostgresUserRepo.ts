import { eq, and } from "drizzle-orm";
import { PgDatabase } from "drizzle-orm/pg-core";
import { BasePostgresRepository } from "@/common/infrastructure/adapters/BasePostgresRepository";
import type { UserRepository } from "@/modules/users/application/ports/UserRepository";
import { UserEntity } from "@/modules/users/domain/UserEntity";
import { users } from "@revstackhq/db";

type UserInsert = typeof users.$inferInsert;
type UserSelect = typeof users.$inferSelect;

export class PostgresUserRepo
  extends BasePostgresRepository<UserEntity, UserInsert, UserSelect>
  implements UserRepository
{
  constructor(db: PgDatabase<any, any, any>) {
    super(db, users);
  }

  protected toDomain(row: UserSelect): UserEntity {
    return UserEntity.restore({
      id: row.id,
      environmentId: row.environmentId,
      email: row.email || "",
      name: undefined,
      role: row.isGuest ? "guest" : "user",
      isActive: true,
      metadata: (row.metadata as Record<string, unknown>) || {},
      createdAt: row.createdAt,
      updatedAt: row.createdAt,
    });
  }

  protected toPersistence(entity: UserEntity): UserInsert {
    return {
      id: entity.id,
      environmentId: entity.environmentId,
      externalId: null,
      isGuest: entity.role === "guest",
      email: entity.email,
      metadata: entity.metadata,
    };
  }

  async findByEmail(environmentId: string, email: string): Promise<UserEntity | null> {
    const rows = await this.db
      .select()
      .from(this.table)
      .where(and(eq(users.environmentId, environmentId), eq(users.email, email)));

    const row = rows[0];
    return row ? this.toDomain(row as UserSelect) : null;
  }

  async find(filters: {
    environmentId?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<UserEntity[]> {
    const conditions = [];
    if (filters.environmentId) conditions.push(eq(users.environmentId, filters.environmentId));
    if (filters.role === "guest") conditions.push(eq(users.isGuest, true));
    else if (filters.role) conditions.push(eq(users.isGuest, false));

    const rows = conditions.length > 0
      ? await this.db.select().from(this.table).where(and(...conditions))
      : await this.db.select().from(this.table);

    return rows.map((row) => this.toDomain(row as UserSelect));
  }
}
