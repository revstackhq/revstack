import type { AddonRepository } from "@/modules/addons/application/ports/AddonRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateAddonCommand } from "@/modules/addons/application/commands/CreateAddonCommand";
import { AddonEntity } from "@/modules/addons/domain/AddonEntity";

export class CreateAddonHandler {
  constructor(
    private readonly repository: AddonRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: CreateAddonCommand) {
    const addon = AddonEntity.create(command);

    await this.repository.save(addon);
    await this.eventBus.publish({ eventName: "addon.created", id: addon.id, environmentId: addon.environmentId });

    return addon.toPrimitives();
  }
}
