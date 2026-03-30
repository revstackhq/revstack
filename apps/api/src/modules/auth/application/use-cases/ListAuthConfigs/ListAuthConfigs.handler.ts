import type { AuthConfigRepository } from "@/modules/auth/application/ports/AuthConfigRepository";
import type { ListAuthConfigsQuery } from "./ListAuthConfigs.schema";

export class ListAuthConfigsHandler {
  constructor(private readonly repository: AuthConfigRepository) {}

  public async execute(query: ListAuthConfigsQuery) {
    const configs = await this.repository.findByEnvironmentId(query.environmentId, query.status);
    return configs.map(c => c.val);
  }
}
