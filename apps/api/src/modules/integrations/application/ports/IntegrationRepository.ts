import type { IntegrationEntity } from "@/modules/integrations/domain/IntegrationEntity";

export interface IntegrationRepository {
  save(integration: IntegrationEntity): Promise<void>;
  findById(id: string): Promise<IntegrationEntity | null>;
  find(filters?: { status?: string; providerId?: string }): Promise<IntegrationEntity[]>;
}
