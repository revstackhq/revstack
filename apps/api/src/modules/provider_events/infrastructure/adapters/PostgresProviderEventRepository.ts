import type { ProviderEventRepository } from "@revstackhq/core";
import type { ProviderEventEntity } from "@revstackhq/core";
import { DrizzleDB } from "@revstackhq/db";

export class PostgresProviderEventRepository implements ProviderEventRepository {
  constructor(private readonly db: DrizzleDB) {}

  public async save(event: ProviderEventEntity): Promise<void> {
    // Scaffold implementation
  }

  public async findById(id: string): Promise<ProviderEventEntity | null> {
    // Scaffold implementation
    return null;
  }

  public async find(filters?: {
    providerId?: string;
    status?: string;
    eventType?: string;
  }): Promise<ProviderEventEntity[]> {
    // Scaffold implementation
    return [];
  }
}
