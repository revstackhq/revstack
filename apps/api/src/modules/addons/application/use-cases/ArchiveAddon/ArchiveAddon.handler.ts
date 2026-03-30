import type { AddonRepository } from "@/modules/addons/application/ports/AddonRepository";
import { AddonNotFoundError } from "@/modules/addons/domain/AddonErrors";
import type {
  ArchiveAddonCommand,
  ArchiveAddonResponse,
} from "./ArchiveAddon.schema";

export class ArchiveAddonHandler {
  constructor(private readonly repository: AddonRepository) {}

  public async execute(
    command: ArchiveAddonCommand,
  ): Promise<ArchiveAddonResponse> {
    const addon = await this.repository.findById(command.id);
    if (!addon) {
      throw new AddonNotFoundError();
    }

    addon.archive();

    await this.repository.save(addon);

    return { success: true };
  }
}
