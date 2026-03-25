import type { AddonRepository } from "@/modules/addons/application/ports/AddonRepository";
import type { GetAddonQuery } from "@/modules/addons/application/queries/GetAddonQuery";
import { AddonNotFoundError } from "@/modules/addons/domain/AddonErrors";

export class GetAddonHandler {
  constructor(private readonly repository: AddonRepository) {}

  public async handle(query: GetAddonQuery) {
    const addon = await this.repository.findById(query.id);
    if (!addon) {
      throw new AddonNotFoundError();
    }
    return addon.toPrimitives();
  }
}
