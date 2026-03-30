import type { EnvironmentRepository } from "@/modules/environments/application/ports/EnvironmentRepository";
import type { DeleteEnvironmentCommand } from "@/modules/environments/application/use-cases/DeleteEnvironment/DeleteEnvironment.schema";
import { EnvironmentNotFoundError } from "@/modules/environments/domain/EnvironmentErrors";
import type { EventBus } from "@/common/application/ports/EventBus";
import { EnvironmentDeletedEvent } from "@/modules/environments/domain/events/EnvironmentEvents";

export class DeleteEnvironmentHandler {
  constructor(
    private readonly repository: EnvironmentRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: DeleteEnvironmentCommand) {
    const environment = await this.repository.findById(command.id);

    if (!environment) {
      throw new EnvironmentNotFoundError();
    }

    environment.canBeDeleted();
    await this.repository.delete(command.id);

    await this.eventBus.publish(
      new EnvironmentDeletedEvent({
        id: environment.val.id!,
        projectId: environment.val.projectId!,
      }),
    );

    return environment.val;
  }
}
