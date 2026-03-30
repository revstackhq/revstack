import type { CreditNoteRepository } from "@/modules/credit_notes/application/ports/CreditNoteRepository";
import type { GetCreditNoteQuery } from "./GetCreditNote.schema";
import { NotFoundError } from "@/common/errors/DomainError";

export class GetCreditNoteHandler {
  constructor(private readonly repository: CreditNoteRepository) {}

  public async execute(query: GetCreditNoteQuery) {
    const creditNote = await this.repository.findById(query.id);
    if (!creditNote) {
      throw new NotFoundError("Credit note not found", "CREDIT_NOTE_NOT_FOUND");
    }

    const v = creditNote.val;
    return {
      id: v.id!,
      invoice_id: v.invoiceId,
      amount: v.amount,
      reason: v.reason,
      status: v.status,
      created_at: v.createdAt,
    };
  }
}
