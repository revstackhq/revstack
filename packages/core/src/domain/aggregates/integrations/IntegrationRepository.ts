import type { IntegrationEntity } from "@/domain/aggregates/integrations/IntegrationEntity";

export interface IntegrationRepository {
  save(integration: IntegrationEntity): Promise<void>;
  findById(id: string): Promise<IntegrationEntity | null>;
  find(filters?: { status?: string; providerId?: string }): Promise<IntegrationEntity[]>;
}
