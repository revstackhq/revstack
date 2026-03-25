import type { AuthConfigRepository } from "@/modules/auth/application/ports/AuthConfigRepository";
import type { ListAuthConfigsQuery } from "@/modules/auth/application/queries/ListAuthConfigsQuery";

export class ListAuthConfigsHandler {
  constructor(private readonly repository: AuthConfigRepository) {}

  public async handle(query: ListAuthConfigsQuery) {
    const configs = await this.repository.findByEnvironmentId(query.environmentId, query.status);
    return configs.map(c => c.toPrimitives());
  }
}
