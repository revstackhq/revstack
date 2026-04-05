import { DomainError } from "@/domain/base/DomainError";

export class WorkspaceMemberNotFoundError extends DomainError {
  constructor() {
    super("Workspace member not found", 404, "WORKSPACE_MEMBER_NOT_FOUND");
  }
}
