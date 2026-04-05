import { z } from "zod";
import type { EnvironmentRepository } from "@revstackhq/core";
import { EnvironmentNotFoundError } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { EnvironmentUpdatedEvent } from "@revstackhq/core";

export const UpdateEnvironmentCommandSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
});

export type UpdateEnvironmentCommand = z.infer<
  typeof UpdateEnvironmentCommandSchema
>;

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
