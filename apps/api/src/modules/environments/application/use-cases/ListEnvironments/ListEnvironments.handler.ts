import type { EnvironmentRepository } from "@/modules/environments/application/ports/EnvironmentRepository";
import type {
  ListEnvironmentsQuery,
  ListEnvironmentsResponse,
} from "./ListEnvironments.schema";
import type { EnvironmentEntity } from "@/modules/environments/domain/EnvironmentEntity";

export class ListEnvironmentsHandler {
  constructor(private readonly repository: EnvironmentRepository) {}

  public async execute(
    query: ListEnvironmentsQuery,
  ): Promise<ListEnvironmentsResponse> {
    const envs = await this.repository.findAll({ projectId: query.project_id });

    return envs.map((e: EnvironmentEntity) => ({
      id: e.val.id!,
      name: e.val.name,
      slug: e.val.slug,
      is_default: e.val.isDefault,
      project_id: e.val.projectId!,
      created_at: e.val.createdAt,
      updated_at: e.val.updatedAt,
    }));
  }
}
