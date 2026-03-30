import type { IntegrationRepository } from "@/modules/integrations/application/ports/IntegrationRepository";
import type { ProviderAdapter } from "@/modules/integrations/application/ports/ProviderAdapter";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { UpdateIntegrationConfigCommand } from "./UpdateIntegrationConfig.schema";
import { NotFoundError } from "@/common/errors/DomainError";

export class UpdateIntegrationConfigHandler {
  constructor(
    private readonly repository: IntegrationRepository,
    private readonly providerAdapter: ProviderAdapter,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: UpdateIntegrationConfigCommand) {
    const integration = await this.repository.findById(command.id);
    if (!integration) {
      throw new NotFoundError("Integration not found", "INTEGRATION_NOT_FOUND");
    }

    const mergedConfig = { ...integration.config, ...command.config };
    const isValid = await this.providerAdapter.verifyCredentials(mergedConfig);
    if (!isValid) {
      throw new Error("Invalid provider credentials with new configuration");
    }

    integration.updateConfig(command.config);
    await this.repository.save(integration);
    await this.providerAdapter.sync(integration.id, integration.config);

    await this.eventBus.publish({ eventName: "integration.config_updated", integrationId: integration.id });

    return { id: integration.id, config: integration.config, status: integration.status };
  }
}
