import { ProviderEventEntity } from "./ProviderEventEntity";

export interface ProviderEventRepository {
  save(event: ProviderEventEntity): Promise<void>;

  findById(params: {
    id: string;
    environmentId: string;
  }): Promise<ProviderEventEntity | null>;

  findByExternalId(params: {
    externalEventId: string;
    environmentId: string;
  }): Promise<ProviderEventEntity | null>;

  listByResource(params: {
    resourceId: string;
    environmentId: string;
  }): Promise<ProviderEventEntity[]>;
}
