import type { ProviderEventEntity } from "@/modules/provider_events/domain/ProviderEventEntity";

export interface ProviderEventRepository {
  save(event: ProviderEventEntity): Promise<void>;
  findById(id: string): Promise<ProviderEventEntity | null>;
  find(filters?: { providerId?: string; status?: string; eventType?: string }): Promise<ProviderEventEntity[]>;
}
