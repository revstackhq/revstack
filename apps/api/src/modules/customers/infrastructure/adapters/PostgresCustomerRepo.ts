import type { ICustomerRepository } from "@/modules/customers/application/ports/ICustomerRepository";
import type { CustomerEntity } from "@/modules/customers/domain/CustomerEntity";

export class PostgresCustomerRepo implements ICustomerRepository {
  constructor(private readonly db: any) {}

  async save(customer: CustomerEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    throw new Error("Method not implemented.");
  }

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<CustomerEntity[]> {
    throw new Error("Method not implemented.");
  }
}
