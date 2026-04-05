import { z } from "zod";
import type { UserRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { UserEntity } from "@revstackhq/core";
import { UserAlreadyExistsError } from "@revstackhq/core";
import { UserCreatedEvent } from "@revstackhq/core";

export const createUserSchema = z.object({
  environmentId: z.string().min(1, "Environment is required"),
  email: z.string().email("Invalid email"),
  name: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  metadata: z.record(z.any()).optional(),
});

export type CreateUserCommand = z.infer<typeof createUserSchema>;

export class CreateUserHandler {
  constructor(
    private readonly repository: UserRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: CreateUserCommand) {
    const existing = await this.repository.findByEmail(command.environmentId, command.email);
    if (existing) {
      throw new UserAlreadyExistsError();
    }

    const user = UserEntity.create(command);

    await this.repository.save(user);
    await this.eventBus.publish(new UserCreatedEvent(user.id, user.environmentId));

    return user.val;
  }
}
