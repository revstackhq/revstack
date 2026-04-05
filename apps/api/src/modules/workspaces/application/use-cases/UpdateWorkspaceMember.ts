import { z } from "zod";
import {
  WorkspaceMemberNotFoundError,
  type WorkspaceMemberRepository,
} from "@revstackhq/core";

export const updateWorkspaceMemberSchema = z.object({
  name: z.string().optional(),
  password_hash: z.string().optional(),
});

export type UpdateWorkspaceMemberCommand = {
  id: string;
} & z.infer<typeof updateWorkspaceMemberSchema>;

export const UpdateWorkspaceMemberResponse = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().optional(),
  role: z.enum(["owner", "admin", "viewer"]),
  environment_id: z.string(),
  created_at: z.date(),
});

export type UpdateWorkspaceMemberResponse = z.infer<
  typeof UpdateWorkspaceMemberResponse
>;

export class UpdateWorkspaceMemberHandler {
  constructor(private readonly repository: WorkspaceMemberRepository) {}

  public async execute(command: UpdateWorkspaceMemberCommand) {
    const member = await this.repository.findById(command.id);

    if (!member) {
      throw new WorkspaceMemberNotFoundError();
    }

    member.update(command.name, command.password_hash);

    await this.repository.save(member);

    return {
      id: member.val.id,
      email: member.val.email,
      name: member.val.name,
      role: member.val.role,
      environment_id: member.val.environmentId,
      created_at: member.val.createdAt,
    };
  }
}
