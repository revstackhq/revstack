import type { AddonRepository } from "@/modules/addons/application/ports/AddonRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { ArchiveAddonCommand } from "@/modules/addons/application/commands/ArchiveAddonCommand";
import { AddonNotFoundError } from "@/modules/addons/domain/AddonErrors";

export class ArchiveAddonHandler {
  constructor(
    private readonly repository: AddonRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: ArchiveAddonCommand) {
    const addon = await this.repository.findById(command.id);
    if (!addon) {
      throw new AddonNotFoundError();
    }

    addon.archive();

    await this.repository.save(addon);
    await this.eventBus.publish({ eventName: "addon.archived", id: addon.id, environmentId: addon.environmentId });

    return { success: true };
  }
}
