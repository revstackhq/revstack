import type { EnvironmentRepository } from "@/modules/environments/application/ports/EnvironmentRepository";
import type { GetEnvironmentQuery } from "@/modules/environments/application/queries/GetEnvironmentQuery";
import { EnvironmentNotFoundError } from "@/modules/environments/domain/EnvironmentErrors";

export class GetEnvironmentHandler {
  constructor(private readonly repository: EnvironmentRepository) {}

  public async handle(query: GetEnvironmentQuery) {
    const environment = await this.repository.findById(query.environmentId);
    if (!environment) {
      throw new EnvironmentNotFoundError();
    }
    return environment.toPrimitives();
  }
}
