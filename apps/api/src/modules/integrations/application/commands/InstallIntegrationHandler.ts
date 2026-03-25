import type { IntegrationRepository } from "@/modules/integrations/application/ports/IntegrationRepository";
import type { ProviderAdapter } from "@/modules/integrations/application/ports/ProviderAdapter";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { InstallIntegrationCommand } from "@/modules/integrations/application/commands/InstallIntegrationCommand";
import { IntegrationEntity } from "@/modules/integrations/domain/IntegrationEntity";

export class InstallIntegrationHandler {
  constructor(
    private readonly repository: IntegrationRepository,
    private readonly providerAdapter: ProviderAdapter,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: InstallIntegrationCommand) {
    const isValid = await this.providerAdapter.verifyCredentials(command.config);
    if (!isValid) {
      throw new Error("Invalid provider credentials");
    }

    const integration = IntegrationEntity.install(command.providerId, command.config);

    await this.repository.save(integration);
    await this.providerAdapter.sync(integration.id, integration.config);
    
    await this.eventBus.publish({ eventName: "integration.installed", integrationId: integration.id });

    return { id: integration.id, status: integration.status };
  }
}
