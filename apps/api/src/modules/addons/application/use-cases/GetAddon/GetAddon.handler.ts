import type { AddonRepository } from "@/modules/addons/application/ports/AddonRepository";
import { AddonNotFoundError } from "@/modules/addons/domain/AddonErrors";
import type { GetAddonQuery, GetAddonResponse } from "./GetAddon.schema";

export class GetAddonHandler {
  constructor(private readonly repository: AddonRepository) {}

  public async execute(query: GetAddonQuery): Promise<GetAddonResponse> {
    const addon = await this.repository.findById(query.id);
    if (!addon) {
      throw new AddonNotFoundError();
    }

    const v = addon.val;
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
  }
}
