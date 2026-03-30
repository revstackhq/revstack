import type { AddonRepository } from "@/modules/addons/application/ports/AddonRepository";
import type {
  ListAddonsQuery,
  ListAddonsResponse,
} from "./ListAddons.schema";

export class ListAddonsHandler {
  constructor(private readonly repository: AddonRepository) {}

  public async execute(query: ListAddonsQuery): Promise<ListAddonsResponse> {
    const addons = await this.repository.find({
      environmentId: query.environment_id,
      isArchived: query.is_archived,
    });

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
