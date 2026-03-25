import type { UserRepository } from "@/modules/users/application/ports/UserRepository";
import type { ListUsersQuery } from "@/modules/users/application/queries/ListUsersQuery";

export class ListUsersHandler {
  constructor(private readonly repository: UserRepository) {}

  public async handle(query: ListUsersQuery) {
    // Rely on the repository to perform filtering so we don't load all users in memory
    const users = await this.repository.find({
      environmentId: query.environmentId,
      role: query.role,
      isActive: query.isActive,
    });
    return users.map(u => u.toPrimitives());
  }
}
