import type { IntegrationRepository } from "@/modules/integrations/application/ports/IntegrationRepository";
import type { ListIntegrationsQuery } from "./ListIntegrations.schema";

export class ListIntegrationsHandler {
  constructor(private readonly repository: IntegrationRepository) {}

  public async execute(query: ListIntegrationsQuery) {
    return this.repository.find({
      status: query.status,
      providerId: query.providerId,
    });
  }
}
