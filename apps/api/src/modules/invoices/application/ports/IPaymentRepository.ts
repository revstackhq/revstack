import type { PaymentEntity } from "@/modules/invoices/domain/PaymentEntity";

export interface IPaymentRepository {
  save(payment: PaymentEntity): Promise<void>;
  findById(id: string): Promise<PaymentEntity | null>;
}
