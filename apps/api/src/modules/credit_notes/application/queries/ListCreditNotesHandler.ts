import type { CreditNoteRepository } from "@/modules/credit_notes/application/ports/CreditNoteRepository";
import type { ListCreditNotesQuery } from "@/modules/credit_notes/application/queries/ListCreditNotesQuery";

export class ListCreditNotesHandler {
  constructor(private readonly repository: CreditNoteRepository) {}

  public async handle(query: ListCreditNotesQuery) {
    const creditNotes = await this.repository.find({
      invoiceId: query.invoiceId,
      status: query.status,
    });
    return creditNotes;
  }
}
