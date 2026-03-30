import type { AddonRepository } from "@/modules/addons/application/ports/AddonRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import { AddonEntity } from "@/modules/addons/domain/AddonEntity";
import type {
  CreateManyAddonsCommand,
  CreateManyAddonsResponse,
} from "./CreateManyAddons.schema";

export class CreateManyAddonsHandler {
  constructor(
    private readonly repository: AddonRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateManyAddonsCommand,
  ): Promise<CreateManyAddonsResponse> {
    const addons = command.addons.map((dto) =>
      AddonEntity.create({
        environmentId: command.environment_id,
        name: dto.name,
        type: dto.type,
        metadata: dto.metadata,
      }),
    );

    await this.repository.saveMany(addons);

    const allEvents = addons.flatMap((a) => a.pullEvents());
    if (allEvents.length > 0) {
      await this.eventBus.publish(allEvents);
    }

    return addons.map((a) => {
      const v = a.val;
      return {
        id: v.id!,
        environment_id: v.environmentId,
        name: v.name,
        type: v.type,
        is_archived: v.isArchived,
        metadata: v.metadata,
        created_at: v.createdAt,
        updated_at: v.updatedAt,
      };
    });
  }
}
