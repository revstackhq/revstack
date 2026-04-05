import type { ProviderEventEntity } from "@/domain/aggregates/provider_events/ProviderEventEntity";

export interface ProviderEventRepository {
  save(event: ProviderEventEntity): Promise<void>;
  findById(id: string): Promise<ProviderEventEntity | null>;
  find(filters?: { providerId?: string; status?: string; eventType?: string }): Promise<ProviderEventEntity[]>;
}
