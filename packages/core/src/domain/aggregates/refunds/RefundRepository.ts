import type {
  RefundEntity,
  RefundStatus,
} from "@/domain/aggregates/refunds/RefundEntity";
import type { PaginatedCursorResult } from "@/types/pagination";

export interface RefundRepository {
  save(refund: RefundEntity): Promise<void>;

  saveMany(entities: RefundEntity[]): Promise<void>;

  findById(params: {
    id: string;
    environmentId: string;
  }): Promise<RefundEntity | null>;

  list(params: {
    environmentId: string;
    paymentId?: string;
    status?: RefundStatus;
    limit?: number;
    cursor?: string;
  }): Promise<PaginatedCursorResult<RefundEntity>>;

  findByPaymentId(params: {
    paymentId: string;
    environmentId: string;
  }): Promise<RefundEntity[]>;

  count(params: {
    environmentId: string;
    status?: RefundStatus;
    paymentId?: string;
  }): Promise<number>;
}
