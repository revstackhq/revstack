import type { StudioAdminEntity } from "@/modules/studio/domain/StudioAdminEntity";

export interface StudioAdminRepository {
  save(admin: StudioAdminEntity): Promise<string>;
  findById(id: string): Promise<StudioAdminEntity | null>;
  findByEmail(email: string): Promise<StudioAdminEntity | null>;
  findAll(): Promise<StudioAdminEntity[]>;
}
