import type { StudioAdminRepository } from "@/modules/studio/application/ports/StudioAdminRepository";
import type { GetStudioAdminQuery } from "./GetStudioAdmin.schema";
import { StudioAdminNotFoundError } from "@/modules/studio/domain/StudioErrors";

export class GetStudioAdminHandler {
  constructor(private readonly repository: StudioAdminRepository) {}

  public async execute(query: GetStudioAdminQuery) {
    const isEmail = query.idOrEmail.includes("@");
    const admin = isEmail 
      ? await this.repository.findByEmail(query.idOrEmail)
      : await this.repository.findById(query.idOrEmail);
      
    if (!admin) {
      throw new StudioAdminNotFoundError();
    }
    
    const primitives = admin.val;
    return { ...primitives, passwordHash: undefined };
  }
}
