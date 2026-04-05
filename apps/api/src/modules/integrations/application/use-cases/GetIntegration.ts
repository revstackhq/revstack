import type { IntegrationRepository } from "@revstackhq/core";
import { NotFoundError } from "@revstackhq/core";

export interface GetIntegrationQuery {
  id: string;
}

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
