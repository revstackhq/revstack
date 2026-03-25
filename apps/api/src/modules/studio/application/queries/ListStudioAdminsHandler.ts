import type { StudioAdminRepository } from "@/modules/studio/application/ports/StudioAdminRepository";
import type { ListStudioAdminsQuery } from "@/modules/studio/application/queries/ListStudioAdminsQuery";

export class ListStudioAdminsHandler {
  constructor(private readonly repository: StudioAdminRepository) {}

  public async handle(_query: ListStudioAdminsQuery) {
    const admins = await this.repository.findAll();
    return admins.map(a => {
      const p = a.toPrimitives();
      return { ...p, passwordHash: undefined };
    });
  }
}
