import type { PaymentEntity } from "@/domain/aggregates/payments/PaymentEntity";

export interface PaymentRepository {
  save(payment: PaymentEntity): Promise<void>;
  findById(id: string): Promise<PaymentEntity | null>;
  find(filters?: { invoiceId?: string; status?: string }): Promise<PaymentEntity[]>;
}
