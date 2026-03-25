import type { UserRepository } from "@/modules/users/application/ports/UserRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateUserCommand } from "@/modules/users/application/commands/CreateUserCommand";
import { UserEntity } from "@/modules/users/domain/UserEntity";
import { UserAlreadyExistsError } from "@/modules/users/domain/UserErrors";
import { UserCreatedEvent } from "@/modules/users/domain/events/UserEvents";

export class CreateUserHandler {
  constructor(
    private readonly repository: UserRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: CreateUserCommand) {
    const existing = await this.repository.findByEmail(command.environmentId, command.email);
    if (existing) {
      throw new UserAlreadyExistsError();
    }

    const user = UserEntity.create(command);

    await this.repository.save(user);
    await this.eventBus.publish(new UserCreatedEvent(user.id, user.environmentId));

    return user.toPrimitives();
  }
}
