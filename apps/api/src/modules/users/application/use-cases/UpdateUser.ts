import { z } from "zod";
import type { UserRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { UserNotFoundError } from "@revstackhq/core";
import { UserUpdatedEvent } from "@revstackhq/core";

export const updateUserSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export type UpdateUserCommand = {
  userId: string;
} & z.infer<typeof updateUserSchema>;

export class UpdateUserHandler {
  constructor(
    private readonly repository: UserRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: UpdateUserCommand) {
    const user = await this.repository.findById(command.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    user.update(command);
    await this.repository.save(user);
    await this.eventBus.publish(new UserUpdatedEvent(user.id, user.environmentId));

    return user.val;
  }
}
