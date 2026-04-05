import {
  WorkspaceMemberNotFoundError,
  type WorkspaceMemberRepository,
} from "@revstackhq/core";
import { z } from "zod";

export const GetMemberDetailsQuery = z.object({
  id: z.string(),
});

export type GetMemberDetailsQuery = z.infer<typeof GetMemberDetailsQuery>;

export const GetMemberDetailsResponse = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().optional(),
  role: z.enum(["owner", "admin", "viewer"]),
  environment_id: z.string(),
  created_at: z.date(),
});

export type GetMemberDetailsResponse = z.infer<typeof GetMemberDetailsResponse>;

export class GetMemberDetailsHandler {
  constructor(private readonly repository: WorkspaceMemberRepository) {}

  public async execute(
    query: GetMemberDetailsQuery,
  ): Promise<GetMemberDetailsResponse> {
    const admin = await this.repository.findById(query.id);

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
