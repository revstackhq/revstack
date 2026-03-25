import type { AddonRepository } from "@/modules/addons/application/ports/AddonRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateManyAddonsCommand } from "@/modules/addons/application/commands/CreateManyAddonsCommand";
import { AddonEntity } from "@/modules/addons/domain/AddonEntity";

export class CreateManyAddonsHandler {
  constructor(
    private readonly repository: AddonRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: CreateManyAddonsCommand) {
    const addons = command.addons.map(dto => AddonEntity.create(dto));

    if (this.repository.saveMany) {
      await this.repository.saveMany(addons);
    } else {
      for (const addon of addons) {
        await this.repository.save(addon);
      }
    }

    for (const addon of addons) {
      await this.eventBus.publish({ eventName: "addon.created", id: addon.id, environmentId: addon.environmentId });
    }

    return addons.map(a => a.toPrimitives());
  }
}
