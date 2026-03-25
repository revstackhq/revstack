import type { ProviderEventRepository } from "@/modules/provider_events/application/ports/ProviderEventRepository";
import type { ProviderEventEntity } from "@/modules/provider_events/domain/ProviderEventEntity";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export class PostgresProviderEventRepo implements ProviderEventRepository {
  constructor(private readonly db: any) {}

  public async save(event: ProviderEventEntity): Promise<void> {
    // Scaffold implementation
  }

  public async findById(id: string): Promise<ProviderEventEntity | null> {
    // Scaffold implementation
    return null;
  }

  public async find(filters?: { providerId?: string; status?: string; eventType?: string }): Promise<ProviderEventEntity[]> {
    // Scaffold implementation
    return [];
  }
}
