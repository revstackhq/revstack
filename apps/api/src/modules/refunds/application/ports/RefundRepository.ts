import type { RefundEntity } from "@/modules/refunds/domain/RefundEntity";

export interface RefundRepository {
  save(refund: RefundEntity): Promise<void>;
  findById(id: string): Promise<RefundEntity | null>;
  find(filters?: { paymentId?: string; status?: string }): Promise<RefundEntity[]>;
}
