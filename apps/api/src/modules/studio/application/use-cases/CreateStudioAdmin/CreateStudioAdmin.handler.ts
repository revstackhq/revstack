import type { StudioAdminRepository } from "@/modules/studio/application/ports/StudioAdminRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateStudioAdminCommand } from "./CreateStudioAdmin.schema";
import { StudioAdminEntity } from "@/modules/studio/domain/StudioAdminEntity";
import { StudioAdminCreatedEvent } from "@/modules/studio/domain/events/StudioEvents";
import { BadRequestError } from "@/common/errors/DomainError";

export class CreateStudioAdminHandler {
  constructor(
    private readonly repository: StudioAdminRepository,
    private readonly eventBus: EventBus
  ) {}

  public async execute(command: CreateStudioAdminCommand) {
    const existing = await this.repository.findByEmail(command.email);
    if (existing) {
      throw new BadRequestError("Admin already exists with this email", "ADMIN_EXISTS");
    }

    const admin = StudioAdminEntity.create(command);

    await this.repository.save(admin);
    await this.eventBus.publish(new StudioAdminCreatedEvent(admin.id, admin.email));

    const primitives = admin.val;
    return { ...primitives, passwordHash: undefined };
  }
}
