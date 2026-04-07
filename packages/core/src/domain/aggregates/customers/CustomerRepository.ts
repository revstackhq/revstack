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

  list(params: {
    environmentId: string;
    limit?: number;
    cursor?: string;
    status?: CustomerStatus;
  }): Promise<PaginatedCursorResult<CustomerEntity>>;

  saveMany(entities: CustomerEntity[]): Promise<void>;
}
