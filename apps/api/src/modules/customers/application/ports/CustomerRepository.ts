import type { CustomerEntity } from "@/modules/customers/domain/CustomerEntity";

export interface CustomerRepository {
  save(customer: CustomerEntity): Promise<string>;
  findById(id: string): Promise<CustomerEntity | null>;
  findByEmail(
    email: string,
    environmentId: string,
  ): Promise<CustomerEntity | null>;
  findByEnvironment(
    environmentId: string,
    pagination?: { limit?: number; offset?: number },
  ): Promise<CustomerEntity[]>;
  saveMany(customers: CustomerEntity[]): Promise<void>;
  delete(id: string, environmentId: string): Promise<boolean>;
}
