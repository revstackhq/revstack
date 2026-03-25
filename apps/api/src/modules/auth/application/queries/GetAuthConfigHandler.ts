import type { AuthConfigRepository } from "@/modules/auth/application/ports/AuthConfigRepository";
import type { GetAuthConfigQuery } from "@/modules/auth/application/queries/GetAuthConfigQuery";
import { AuthConfigNotFoundError } from "@/modules/auth/domain/AuthErrors";

export class GetAuthConfigHandler {
  constructor(private readonly repository: AuthConfigRepository) {}

  public async handle(query: GetAuthConfigQuery) {
    const config = await this.repository.findById(query.id);
    if (!config) {
      throw new AuthConfigNotFoundError();
    }
    return config.toPrimitives();
  }
}
