import type { CreditNoteEntity } from "@/domain/aggregates/invoices/CreditNoteEntity";

export interface CreditNoteRepository {
  save(creditNote: CreditNoteEntity): Promise<void>;
  findById(id: string): Promise<CreditNoteEntity | null>;
  find(filters?: { invoiceId?: string; status?: string }): Promise<CreditNoteEntity[]>;
}
