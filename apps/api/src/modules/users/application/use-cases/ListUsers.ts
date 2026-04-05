import { z } from "zod";
import type { UserRepository } from "@revstackhq/core";

export const listUsersSchema = z.object({
  environmentId: z.string().optional(),
  role: z.string().optional(),
  isActive: z.enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
});

export type ListUsersQuery = z.infer<typeof listUsersSchema>;

export class ListUsersHandler {
  constructor(private readonly repository: UserRepository) {}

  public async execute(query: ListUsersQuery) {
    // Rely on the repository to perform filtering so we don't load all users in memory
    const users = await this.repository.find({
      environmentId: query.environmentId,
      role: query.role,
      isActive: query.isActive,
    });
    return users.map(u => u.val);
  }
}
