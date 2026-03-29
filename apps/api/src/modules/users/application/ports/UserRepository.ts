import type { UserEntity } from "@/modules/users/domain/UserEntity";

export interface UserRepository {
  save(user: UserEntity): Promise<string>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(environmentId: string, email: string): Promise<UserEntity | null>;
  find(filters: {
    environmentId?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<UserEntity[]>;
}
