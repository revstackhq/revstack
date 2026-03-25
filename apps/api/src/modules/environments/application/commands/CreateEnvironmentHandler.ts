import type { EnvironmentRepository } from "@/modules/environments/application/ports/EnvironmentRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateEnvironmentCommand } from "@/modules/environments/application/commands/CreateEnvironmentCommand";
import { EnvironmentEntity } from "@/modules/environments/domain/EnvironmentEntity";
import { EnvironmentCreatedEvent } from "@/modules/environments/domain/events/EnvironmentEvents";

export class CreateEnvironmentHandler {
  constructor(
    private readonly repository: EnvironmentRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: CreateEnvironmentCommand) {
    const environment = EnvironmentEntity.create(command);

    await this.repository.save(environment);
    
    await this.eventBus.publish(
      new EnvironmentCreatedEvent(environment.id, environment.projectId)
    );

    return environment.toPrimitives();
  }
}
