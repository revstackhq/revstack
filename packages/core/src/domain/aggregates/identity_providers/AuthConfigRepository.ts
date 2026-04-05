import type { AuthConfigEntity } from "@/domain/aggregates/identity_providers/AuthConfigEntity";

export interface AuthConfigRepository {
  save(config: AuthConfigEntity): Promise<string>;
  findById(id: string): Promise<AuthConfigEntity | null>;
  findByEnvironmentId(
    environmentId: string,
    status?: string,
  ): Promise<AuthConfigEntity[]>;
}
