import type { EnvironmentEntity } from "@/modules/environments/domain/EnvironmentEntity";

export interface EnvironmentRepository {
  save(environment: EnvironmentEntity): Promise<void>;
  findById(id: string): Promise<EnvironmentEntity | null>;
  delete(id: string): Promise<void>;
  findAll(): Promise<EnvironmentEntity[]>;
}
