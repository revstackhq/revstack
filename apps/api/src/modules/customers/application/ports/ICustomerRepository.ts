import type { CustomerEntity } from "@/modules/customers/domain/CustomerEntity";

export interface ICustomerRepository {
  save(customer: CustomerEntity): Promise<void>;
  findById(id: string): Promise<CustomerEntity | null>;
  findByEmail(email: string): Promise<CustomerEntity | null>;
  findAll(): Promise<CustomerEntity[]>;
}
