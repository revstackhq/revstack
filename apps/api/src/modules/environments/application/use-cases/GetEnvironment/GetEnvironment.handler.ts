import type { EnvironmentRepository } from "@/modules/environments/application/ports/EnvironmentRepository";
import type {
  GetEnvironmentQuery,
  GetEnvironmentResponse,
} from "@/modules/environments/application/use-cases/GetEnvironment/GetEnvironment.schema";
import { EnvironmentNotFoundError } from "@/modules/environments/domain/EnvironmentErrors";

export class GetEnvironmentHandler {
  constructor(private readonly repository: EnvironmentRepository) {}

  public async execute(
    query: GetEnvironmentQuery,
  ): Promise<GetEnvironmentResponse> {
    const environment = await this.repository.findById(query.id);

    if (!environment) {
      throw new EnvironmentNotFoundError();
    }

    return {
      id: environment.val.id!,
      name: environment.val.name,
      slug: environment.val.slug,
      is_default: environment.val.isDefault,
      project_id: environment.val.projectId!,
      created_at: environment.val.createdAt,
      updated_at: environment.val.updatedAt,
    };
  }
}
