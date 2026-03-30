import type { AuthConfigRepository } from "@/modules/auth/application/ports/AuthConfigRepository";
import type { GetAuthConfigQuery } from "./GetAuthConfig.schema";
import { AuthConfigNotFoundError } from "@/modules/auth/domain/AuthErrors";

export class GetAuthConfigHandler {
  constructor(private readonly repository: AuthConfigRepository) {}

  public async execute(query: GetAuthConfigQuery) {
    const config = await this.repository.findById(query.id);
    if (!config) {
      throw new AuthConfigNotFoundError();
    }
    return config.val;
  }
}
