import type { AddonRepository } from "@/modules/addons/application/ports/AddonRepository";
import type { ListAddonsQuery } from "@/modules/addons/application/queries/ListAddonsQuery";

export class ListAddonsHandler {
  constructor(private readonly repository: AddonRepository) {}

  public async handle(query: ListAddonsQuery) {
    const addons = await this.repository.find({
      environmentId: query.environmentId,
      isArchived: query.isArchived,
    });
    return addons.map(a => a.toPrimitives());
  }
}
