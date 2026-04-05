import type { UserRepository } from "@revstackhq/core";
import { UserNotFoundError } from "@revstackhq/core";

export interface GetUserQuery {
  id: string;
}

export class GetUserHandler {
  constructor(private readonly repository: UserRepository) {}

  public async execute(query: GetUserQuery) {
    const user = await this.repository.findById(query.id);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user.val;
  }
}
