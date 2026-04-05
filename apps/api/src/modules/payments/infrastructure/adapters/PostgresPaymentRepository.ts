import type { PaymentRepository } from "@revstackhq/core";
import type { PaymentEntity } from "@revstackhq/core";

export class PostgresPaymentRepository implements PaymentRepository {
  constructor(private readonly db: any) {}

  async save(payment: PaymentEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<PaymentEntity | null> {
    throw new Error("Method not implemented.");
  }

  public async find(filters?: { invoiceId?: string; status?: string }): Promise<PaymentEntity[]> {
    return []; // Implement
  }
}
