import { DomainError } from "@/common/errors/DomainError";

export class StudioAdminNotFoundError extends DomainError {
  constructor() {
    super("Studio admin not found", 404, "ADMIN_NOT_FOUND");
  }
}
