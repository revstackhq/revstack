import type { AuthConfigRepository } from "@revstackhq/core";
import { AuthConfigNotFoundError } from "@revstackhq/core";

export interface GetAuthConfigQuery {
  id: string;
}

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
