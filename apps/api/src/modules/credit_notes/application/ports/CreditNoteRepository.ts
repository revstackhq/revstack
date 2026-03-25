import type { CreditNoteEntity } from "@/modules/credit_notes/domain/CreditNoteEntity";

export interface CreditNoteRepository {
  save(creditNote: CreditNoteEntity): Promise<void>;
  findById(id: string): Promise<CreditNoteEntity | null>;
  find(filters?: { invoiceId?: string; status?: string }): Promise<CreditNoteEntity[]>;
}
