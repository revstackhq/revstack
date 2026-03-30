import type { CreditNoteRepository } from "@/modules/credit_notes/application/ports/CreditNoteRepository";
import type { ListCreditNotesQuery } from "./ListCreditNotes.schema";

export class ListCreditNotesHandler {
  constructor(private readonly repository: CreditNoteRepository) {}

  public async execute(query: ListCreditNotesQuery) {
    const creditNotes = await this.repository.find({
      invoiceId: query.invoice_id,
      status: query.status,
    });
    return creditNotes.map((cn: any) => {
      const v = cn.val ?? cn;
      return {
        id: v.id ?? v.id,
        invoice_id: v.invoiceId ?? v.invoice_id,
        amount: v.amount,
        reason: v.reason,
        status: v.status,
        created_at: v.createdAt ?? v.created_at,
      };
    });
  }
}
