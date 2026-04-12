import type { EnvironmentEntity } from "@/domain/aggregates/environments/EnvironmentEntity";

export interface EnvironmentRepository {
  save(environment: EnvironmentEntity): Promise<string>;

  findById(params: { id: string }): Promise<EnvironmentEntity | null>;

  listByProjectId(params: { projectId: string }): Promise<EnvironmentEntity[]>;

  findBySlug(params: {
    projectId: string;
    slug: string;
  }): Promise<EnvironmentEntity | null>;

  list(params: { projectId: string }): Promise<EnvironmentEntity[]>;
}
