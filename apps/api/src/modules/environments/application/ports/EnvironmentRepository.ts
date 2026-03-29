import type { EnvironmentEntity } from "@/modules/environments/domain/EnvironmentEntity";

export interface EnvironmentRepository {
  save(environment: EnvironmentEntity): Promise<string>;
  findById(id: string): Promise<EnvironmentEntity | null>;
  findByProjectId(projectId: string): Promise<EnvironmentEntity[]>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<EnvironmentEntity[]>;
}
