import { z } from "zod";
import type { EnvironmentRepository } from "@revstackhq/core";
import { EnvironmentNotFoundError } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { EnvironmentDeletedEvent } from "@revstackhq/core";

export const DeleteEnvironmentCommandSchema = z.object({
  id: z.string(),
});

export type DeleteEnvironmentCommand = z.infer<
  typeof DeleteEnvironmentCommandSchema
>;

export const DeleteEnvironmentResponseSchema = z.object({
  id: z.string(),
});

export type DeleteEnvironmentResponse = z.infer<
  typeof DeleteEnvironmentResponseSchema
>;







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
