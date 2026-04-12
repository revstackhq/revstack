import type {
  CustomerEntity,
  CustomerStatus,
} from "@/domain/aggregates/customers/CustomerEntity";
import type { PaginatedCursorResult } from "@/types/pagination";

export interface CustomerRepository {
  save(customer: CustomerEntity): Promise<void>;

  findById(params: {
    id: string;
    environmentId: string;
  }): Promise<CustomerEntity | null>;

  findByExternalId(params: {
    externalId: string;
    environmentId: string;
  }): Promise<CustomerEntity | null>;

  findByEmail(params: {
    email: string;
    environmentId: string;
  }): Promise<CustomerEntity | null>;

  findByProviderId(params: {
    providerId: string;
    environmentId: string;
  }): Promise<CustomerEntity | null>;

  list(params: {
    environmentId: string;
    limit?: number;
    cursor?: string;
    status?: CustomerStatus;
    search?: string;
  }): Promise<PaginatedCursorResult<CustomerEntity>>;

  saveMany(entities: CustomerEntity[]): Promise<void>;
}
