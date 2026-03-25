import type { EnvironmentRepository } from "@/modules/environments/application/ports/EnvironmentRepository";
import type { UpdateEnvironmentCommand } from "@/modules/environments/application/commands/UpdateEnvironmentCommand";
import { EnvironmentNotFoundError } from "@/modules/environments/domain/EnvironmentErrors";

export class UpdateEnvironmentHandler {
  constructor(private readonly repository: EnvironmentRepository) {}

  public async handle(command: UpdateEnvironmentCommand) {
    const environment = await this.repository.findById(command.environmentId);
    if (!environment) {
      throw new EnvironmentNotFoundError();
    }

    environment.updateName(command.name);
    await this.repository.save(environment);

    return environment.toPrimitives();
  }
}
