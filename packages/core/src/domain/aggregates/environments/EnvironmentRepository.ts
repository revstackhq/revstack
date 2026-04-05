import type { EnvironmentEntity } from "@/domain/aggregates/environments/EnvironmentEntity";

export interface EnvironmentRepository {
  save(environment: EnvironmentEntity): Promise<string>;
  findById(id: string): Promise<EnvironmentEntity | null>;
  findByProjectId(projectId: string): Promise<EnvironmentEntity[]>;
  delete(id: string): Promise<boolean>;
  findAll(params?: { projectId?: string }): Promise<EnvironmentEntity[]>;
}
