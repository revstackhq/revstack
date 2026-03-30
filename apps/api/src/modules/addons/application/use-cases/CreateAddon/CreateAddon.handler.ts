import type { AddonRepository } from "@/modules/addons/application/ports/AddonRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import { AddonEntity } from "@/modules/addons/domain/AddonEntity";
import type {
  CreateAddonCommand,
  CreateAddonResponse,
} from "./CreateAddon.schema";

export class CreateAddonHandler {
  constructor(
    private readonly repository: AddonRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateAddonCommand,
  ): Promise<CreateAddonResponse> {
    const addon = AddonEntity.create({
      environmentId: command.environment_id,
      name: command.name,
      type: command.type,
      metadata: command.metadata,
    });

    await this.repository.save(addon);
    await this.eventBus.publish(addon.pullEvents());

    const v = addon.val;
    return {
      id: v.id!,
      environment_id: v.environmentId,
      name: v.name,
      type: v.type,
      is_archived: v.isArchived,
      created_at: v.createdAt,
      updated_at: v.updatedAt,
    };
  }
}
