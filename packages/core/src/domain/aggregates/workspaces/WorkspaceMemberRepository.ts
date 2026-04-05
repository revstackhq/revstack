import type { WorkspaceMemberEntity } from "@/domain/aggregates/workspaces/WorkspaceMemberEntity";

export interface WorkspaceMemberRepository {
  save(member: WorkspaceMemberEntity): Promise<string>;
  findById(id: string): Promise<WorkspaceMemberEntity | null>;
  findByEmail(email: string): Promise<WorkspaceMemberEntity | null>;
  findAll(): Promise<WorkspaceMemberEntity[]>;
}
