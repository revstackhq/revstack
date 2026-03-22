import type { IPaymentRepository } from "@/modules/invoices/application/ports/IPaymentRepository";
import type { PaymentEntity } from "@/modules/invoices/domain/PaymentEntity";

export class PostgresPaymentRepo implements IPaymentRepository {
  constructor(private readonly db: any) {}

  async save(payment: PaymentEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<PaymentEntity | null> {
    throw new Error("Method not implemented.");
  }
}
