import {
  IdentityProviderEntity,
  IdentityProviderStatus,
} from "./IdentityProviderEntity";

export interface IdentityProviderRepository {
  save(entity: IdentityProviderEntity): Promise<string>;

  findById(params: {
    id: string;
    environmentId: string;
  }): Promise<IdentityProviderEntity | null>;

  findMany(params: {
    environmentId: string;
    status?: IdentityProviderStatus;
  }): Promise<IdentityProviderEntity[]>;

  findActive(params: {
    environmentId: string;
  }): Promise<IdentityProviderEntity | null>;

  delete(params: { id: string; environmentId: string }): Promise<void>;
}
