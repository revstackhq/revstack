import type { StudioAdminRepository } from "@/modules/studio/application/ports/StudioAdminRepository";
import type { GetStudioAdminQuery } from "@/modules/studio/application/queries/GetStudioAdminQuery";
import { StudioAdminNotFoundError } from "@/modules/studio/domain/StudioErrors";

export class GetStudioAdminHandler {
  constructor(private readonly repository: StudioAdminRepository) {}

  public async handle(query: GetStudioAdminQuery) {
    const isEmail = query.idOrEmail.includes("@");
    const admin = isEmail 
      ? await this.repository.findByEmail(query.idOrEmail)
      : await this.repository.findById(query.idOrEmail);
      
    if (!admin) {
      throw new StudioAdminNotFoundError();
    }
    
    const primitives = admin.toPrimitives();
    return { ...primitives, passwordHash: undefined };
  }
}
