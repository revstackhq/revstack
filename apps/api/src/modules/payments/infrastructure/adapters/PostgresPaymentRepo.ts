import type { PaymentRepository } from "@/modules/payments/application/ports/PaymentRepository";
import type { PaymentEntity } from "@/modules/payments/domain/PaymentEntity";

export class PostgresPaymentRepo implements PaymentRepository {
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
