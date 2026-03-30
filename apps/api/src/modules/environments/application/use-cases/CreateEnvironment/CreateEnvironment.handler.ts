import type { EnvironmentRepository } from "@/modules/environments/application/ports/EnvironmentRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateEnvironmentCommand } from "./CreateEnvironment.schema";
import { EnvironmentEntity } from "@/modules/environments/domain/EnvironmentEntity";
import { EnvironmentCreatedEvent } from "@/modules/environments/domain/events/EnvironmentEvents";

export class CreateEnvironmentHandler {
  constructor(
    private readonly repository: EnvironmentRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: CreateEnvironmentCommand) {
    const environment = EnvironmentEntity.create({
      name: command.name,
      slug: command.slug,
      isDefault: command.is_default,
      projectId: command.project_id,
    });

    await this.repository.save(environment);

    await this.eventBus.publish(
      new EnvironmentCreatedEvent({
        id: environment.val.id!,
        projectId: environment.val.projectId!,
      }),
    );

    return environment.val;
  }
}
