import { z } from "zod";
import type { IntegrationRepository } from "@revstackhq/core";
import type { ProviderAdapter } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { IntegrationEntity } from "@revstackhq/core";

export const installIntegrationSchema = z.object({
  providerId: z.string(),
  config: z.record(z.any()),
});

export type InstallIntegrationCommand = z.infer<typeof installIntegrationSchema>;

export class InstallIntegrationHandler {
  constructor(
    private readonly repository: IntegrationRepository,
    private readonly providerAdapter: ProviderAdapter,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: InstallIntegrationCommand) {
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
