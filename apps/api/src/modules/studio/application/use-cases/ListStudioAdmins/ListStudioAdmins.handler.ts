import type { StudioAdminRepository } from "@/modules/studio/application/ports/StudioAdminRepository";
import type { ListStudioAdminsQuery } from "./ListStudioAdmins.schema";

export class ListStudioAdminsHandler {
  constructor(private readonly repository: StudioAdminRepository) {}

  public async execute(_query: ListStudioAdminsQuery) {
    const admins = await this.repository.findAll();
    return admins.map(a => {
      const p = a.val;
      return { ...p, passwordHash: undefined };
    });
  }
}
