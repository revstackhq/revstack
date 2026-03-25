import type { CreditNoteRepository } from "@/modules/credit_notes/application/ports/CreditNoteRepository";
import type { GetCreditNoteQuery } from "@/modules/credit_notes/application/queries/GetCreditNoteQuery";
import { NotFoundError } from "@/common/errors/DomainError";

export class GetCreditNoteHandler {
  constructor(private readonly repository: CreditNoteRepository) {}

  public async handle(query: GetCreditNoteQuery) {
    const creditNote = await this.repository.findById(query.id);
    if (!creditNote) {
      throw new NotFoundError("Credit note not found", "CREDIT_NOTE_NOT_FOUND");
    }
    return creditNote;
  }
}
