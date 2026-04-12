import { UserEntity } from "./UserEntity";
import { PaginatedCursorResult } from "@/types/pagination";

export interface UserRepository {
  save(user: UserEntity): Promise<void>;

  findById(params: {
    id: string;
    environmentId: string;
  }): Promise<UserEntity | null>;

  findByEmail(params: {
    email: string;
    environmentId: string;
  }): Promise<UserEntity | null>;

  list(params: {
    environmentId: string;
    limit?: number;
    cursor?: string;
    role?: string;
  }): Promise<PaginatedCursorResult<UserEntity>>;

  saveMany(users: UserEntity[]): Promise<void>;
}
