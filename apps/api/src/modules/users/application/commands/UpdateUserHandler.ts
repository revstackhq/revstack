import type { UserRepository } from "@/modules/users/application/ports/UserRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { UpdateUserCommand } from "@/modules/users/application/commands/UpdateUserCommand";
import { UserNotFoundError } from "@/modules/users/domain/UserErrors";
import { UserUpdatedEvent } from "@/modules/users/domain/events/UserEvents";

export class UpdateUserHandler {
  constructor(
    private readonly repository: UserRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: UpdateUserCommand) {
    const user = await this.repository.findById(command.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    user.update(command);
    await this.repository.save(user);
    await this.eventBus.publish(new UserUpdatedEvent(user.id, user.environmentId));

    return user.toPrimitives();
  }
}
