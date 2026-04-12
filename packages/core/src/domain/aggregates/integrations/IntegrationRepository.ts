import { IntegrationEntity, IntegrationStatus } from "./IntegrationEntity";

export interface IntegrationRepository {
  save(integration: IntegrationEntity): Promise<void>;

  findById(params: {
    id: string;
    environmentId: string;
  }): Promise<IntegrationEntity | null>;

  list(params: {
    environmentId: string;
    includeArchived?: boolean;
    status?: IntegrationStatus;
  }): Promise<IntegrationEntity[]>;
}
