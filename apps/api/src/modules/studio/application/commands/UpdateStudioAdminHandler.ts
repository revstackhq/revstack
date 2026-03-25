import type { StudioAdminRepository } from "@/modules/studio/application/ports/StudioAdminRepository";
import type { UpdateStudioAdminCommand } from "@/modules/studio/application/commands/UpdateStudioAdminCommand";
import { StudioAdminNotFoundError } from "@/modules/studio/domain/StudioErrors";

export class UpdateStudioAdminHandler {
  constructor(private readonly repository: StudioAdminRepository) {}

  public async handle(command: UpdateStudioAdminCommand) {
    const admin = await this.repository.findById(command.adminId);
    if (!admin) {
      throw new StudioAdminNotFoundError();
    }

    admin.update(command.name, command.passwordHash);
    await this.repository.save(admin);

    const primitives = admin.toPrimitives();
    return { ...primitives, passwordHash: undefined };
  }
}
