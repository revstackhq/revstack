import { z } from "zod";
import type { EnvironmentRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { EnvironmentEntity } from "@revstackhq/core";
import { EnvironmentCreatedEvent } from "@revstackhq/core";

export const CreateEnvironmentCommandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  is_default: z.boolean().default(false),
  project_id: z.string().optional(),
});

export type CreateEnvironmentCommand = z.infer<
  typeof CreateEnvironmentCommandSchema
>;

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
