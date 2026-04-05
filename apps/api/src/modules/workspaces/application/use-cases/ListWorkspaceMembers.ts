import type { WorkspaceMemberRepository } from "@revstackhq/core";
import { z } from "zod";

export const ListWorkspaceMembersQuery = z.object({});

export type ListWorkspaceMembersQuery = z.infer<
  typeof ListWorkspaceMembersQuery
>;

export const ListWorkspaceMembersResponse = z.array(
  z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().optional(),
    role: z.enum(["owner", "admin", "viewer"]),
    environment_id: z.string(),
    created_at: z.date(),
  }),
);

export type ListWorkspaceMembersResponse = z.infer<
  typeof ListWorkspaceMembersResponse
>;

export class ListWorkspaceMembersHandler {
  constructor(private readonly repository: WorkspaceMemberRepository) {}

  public async execute(
    _query: ListWorkspaceMembersQuery,
  ): Promise<ListWorkspaceMembersResponse> {
    const admins = await this.repository.findAll();

    return admins.map((admin) => {
      return {
        id: admin.val.id,
        email: admin.val.email,
        name: admin.val.name,
        role: admin.val.role,
        environment_id: admin.val.environmentId,
        created_at: admin.val.createdAt,
      };
    });
  }
}
