import type { IntegrationRepository } from "@/modules/integrations/application/ports/IntegrationRepository";
import type { ListIntegrationsQuery } from "@/modules/integrations/application/queries/ListIntegrationsQuery";

export class ListIntegrationsHandler {
  constructor(private readonly repository: IntegrationRepository) {}

  public async handle(query: ListIntegrationsQuery) {
    return this.repository.find({
      status: query.status,
      providerId: query.providerId,
    });
  }
}
