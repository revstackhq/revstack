import type { EnvironmentRepository } from "@/modules/environments/application/ports/EnvironmentRepository";
import type { ListEnvironmentsQuery } from "@/modules/environments/application/queries/ListEnvironmentsQuery";
import type { EnvironmentEntity } from "@/modules/environments/domain/EnvironmentEntity";

export class ListEnvironmentsHandler {
  constructor(private readonly repository: EnvironmentRepository) {}

  public async handle(query: ListEnvironmentsQuery) {
    const envs = await this.repository.findAll();
    // Assuming filters would be applied here or in repo
    const filtered = query.projectId 
      ? envs.filter((e: EnvironmentEntity) => e.projectId === query.projectId)
      : envs;
    return filtered.map((e: EnvironmentEntity) => e.toPrimitives());
  }
}
