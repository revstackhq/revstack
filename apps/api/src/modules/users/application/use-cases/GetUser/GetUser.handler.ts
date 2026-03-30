import type { UserRepository } from "@/modules/users/application/ports/UserRepository";
import type { GetUserQuery } from "./GetUser.schema";
import { UserNotFoundError } from "@/modules/users/domain/UserErrors";

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
