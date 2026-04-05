import { z } from "zod";
import type { WorkspaceMemberRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { WorkspaceMemberEntity } from "@revstackhq/core";
import { WorkspaceMemberCreatedEvent } from "@revstackhq/core";
import { BadRequestError } from "@revstackhq/core";

export const createWorkspaceMemberSchema = z.object({
  email: z.string().email("Invalid email"),
  password_hash: z.string().min(1, "Password hash required"),
  name: z.string().optional(),
  role: z.enum(["owner", "admin", "viewer"]).default("admin"),
  environment_id: z.string().min(1, "Environment ID required"),
});

export type CreateWorkspaceMemberCommand = z.infer<
  typeof createWorkspaceMemberSchema
>;

export const CreateWorkspaceMemberResponse = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().optional(),
  role: z.enum(["owner", "admin", "viewer"]),
  environment_id: z.string(),
  created_at: z.date(),
});

export type CreateWorkspaceMemberResponse = z.infer<
  typeof CreateWorkspaceMemberResponse
>;

export class CreateWorkspaceMemberHandler {
  constructor(
    private readonly repository: WorkspaceMemberRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(
    command: CreateWorkspaceMemberCommand,
  ): Promise<CreateWorkspaceMemberResponse> {
    const existing = await this.repository.findByEmail(command.email);
    if (existing) {
      throw new BadRequestError(
        "Workspace member already exists with this email",
        "MEMBER_EXISTS",
      );
    }

    const member = WorkspaceMemberEntity.create({
      email: command.email,
      passwordHash: command.password_hash,
      name: command.name,
      role: command.role,
      environmentId: command.environment_id,
    });

    await this.repository.save(member);

    await this.eventBus.publish(
      new WorkspaceMemberCreatedEvent({
        id: member.val.id,
        email: member.val.email,
      }),
    );

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
