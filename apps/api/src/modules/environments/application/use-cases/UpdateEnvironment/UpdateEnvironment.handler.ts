import type { EnvironmentRepository } from "@/modules/environments/application/ports/EnvironmentRepository";
import type { UpdateEnvironmentCommand } from "./UpdateEnvironment.schema";
import { EnvironmentNotFoundError } from "@/modules/environments/domain/EnvironmentErrors";
import type { EventBus } from "@/common/application/ports/EventBus";
import { EnvironmentUpdatedEvent } from "@/modules/environments/domain/events/EnvironmentEvents";

export class UpdateEnvironmentHandler {
  constructor(
    private readonly repository: EnvironmentRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: UpdateEnvironmentCommand) {
    const environment = await this.repository.findById(command.id);
    if (!environment) {
      throw new EnvironmentNotFoundError();
    }

    environment.updateName(command.name);
    await this.repository.save(environment);

    await this.eventBus.publish(
      new EnvironmentUpdatedEvent({
        id: environment.val.id!,
        projectId: environment.val.projectId!,
      }),
    );

    return environment.val;
  }
}
