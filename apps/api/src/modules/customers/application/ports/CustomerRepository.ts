import type { CustomerEntity } from "@/modules/customers/domain/CustomerEntity";

export interface CustomerRepository {
  save(customer: CustomerEntity): Promise<void>;
  findById(id: string): Promise<CustomerEntity | null>;
  findByEmail(email: string): Promise<CustomerEntity | null>;
  findAll(): Promise<CustomerEntity[]>;
  saveMany?(customers: CustomerEntity[]): Promise<void>;
  delete?(id: string): Promise<void>;
}
