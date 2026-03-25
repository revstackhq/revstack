import type { AuthConfigEntity } from "@/modules/auth/domain/AuthConfigEntity";

export interface AuthConfigRepository {
  save(config: AuthConfigEntity): Promise<void>;
  findById(id: string): Promise<AuthConfigEntity | null>;
  findByEnvironmentId(environmentId: string, status?: string): Promise<AuthConfigEntity[]>;
}
