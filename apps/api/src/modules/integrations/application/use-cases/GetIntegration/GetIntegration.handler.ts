import type { IntegrationRepository } from "@/modules/integrations/application/ports/IntegrationRepository";
import type { GetIntegrationQuery } from "./GetIntegration.schema";
import { NotFoundError } from "@/common/errors/DomainError";

export class GetIntegrationHandler {
  constructor(private readonly repository: IntegrationRepository) {}

  public async execute(query: GetIntegrationQuery) {
    const integration = await this.repository.findById(query.id);
    if (!integration) {
      throw new NotFoundError("Integration not found", "INTEGRATION_NOT_FOUND");
    }
    return integration;
  }
}
