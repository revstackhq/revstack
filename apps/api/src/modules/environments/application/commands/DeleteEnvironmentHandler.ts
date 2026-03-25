import type { EnvironmentRepository } from "@/modules/environments/application/ports/EnvironmentRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import { EnvironmentNotFoundError } from "@/modules/environments/domain/EnvironmentErrors";
import { EnvironmentDeletedEvent } from "@/modules/environments/domain/events/EnvironmentEvents";

export class DeleteEnvironmentHandler {
  constructor(
    private readonly repository: EnvironmentRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: { environmentId: string }) {
    const environment = await this.repository.findById(command.environmentId);
    if (!environment) {
      throw new EnvironmentNotFoundError();
    }

    environment.delete(); // Applies domain constraints (e.g. cannot delete default env)
    
    await this.repository.delete(environment.id);

    await this.eventBus.publish(new EnvironmentDeletedEvent(environment.id));

    return { success: true };
  }
}
