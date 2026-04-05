import { BadRequestError } from "@/common/errors/DomainError";
import type { WorkspaceMemberRepository } from "@revstackhq/core";
import { WorkspaceMemberNotFoundError } from "@revstackhq/core";
import { z } from "zod";

export const GetWorkspaceMemberQuery = z.object({
  id: z.string().optional(),
  email: z.string().optional(),
});

export type GetWorkspaceMemberQuery = z.infer<typeof GetWorkspaceMemberQuery>;

export const GetWorkspaceMemberResponse = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().optional(),
  role: z.enum(["owner", "admin", "viewer"]),
  environment_id: z.string(),
  created_at: z.date(),
});

export type GetWorkspaceMemberResponse = z.infer<
  typeof GetWorkspaceMemberResponse
>;

export class GetWorkspaceMemberHandler {
  constructor(private readonly repository: WorkspaceMemberRepository) {}

  public async execute(
    query: GetWorkspaceMemberQuery,
  ): Promise<GetWorkspaceMemberResponse> {
    if (!query.id && !query.email) {
      throw new BadRequestError("Id or email is required", "INVALID_REQUEST");
    }

    const isEmail = query.email?.includes("@");

    const admin = isEmail
      ? await this.repository.findByEmail(query.email!)
      : await this.repository.findById(query.id!);

    if (!admin) {
      throw new WorkspaceMemberNotFoundError();
    }

    return {
      id: admin.val.id,
      email: admin.val.email,
      name: admin.val.name,
      role: admin.val.role,
      environment_id: admin.val.environmentId,
      created_at: admin.val.createdAt,
    };
  }
}
