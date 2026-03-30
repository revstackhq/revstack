import type { AuthConfigRepository } from "@/modules/auth/application/ports/AuthConfigRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { PutAuthConfigCommand } from "./PutAuthConfig.schema";
import { AuthConfigEntity } from "@/modules/auth/domain/AuthConfigEntity";
import { AuthConfigUpdatedEvent } from "@/modules/auth/domain/events/AuthConfigEvents";

export class PutAuthConfigHandler {
  constructor(
    private readonly repository: AuthConfigRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: PutAuthConfigCommand) {
    // Determine if config already exists for environment to treat this as an UPSERT
    const existingConfigs = await this.repository.findByEnvironmentId(command.environmentId);
    let config = existingConfigs[0];

    if (config) {
      config.update(command);
    } else {
      config = AuthConfigEntity.create(command);
    }

    await this.repository.save(config);

    await this.eventBus.publish(new AuthConfigUpdatedEvent(config.id, config.environmentId));

    return config.val;
  }
}
