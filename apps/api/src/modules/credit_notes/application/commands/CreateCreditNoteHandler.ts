import type { CreditNoteRepository } from "@/modules/credit_notes/application/ports/CreditNoteRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateCreditNoteCommand } from "@/modules/credit_notes/application/commands/CreateCreditNoteCommand";
import { CreditNoteEntity } from "@/modules/credit_notes/domain/CreditNoteEntity";

export class CreateCreditNoteHandler {
  constructor(
    private readonly repository: CreditNoteRepository,
    private readonly eventBus: EventBus
  ) {}

  public async handle(command: CreateCreditNoteCommand) {
    const creditNote = CreditNoteEntity.issue(
      command.invoiceId,
      command.amount,
      command.reason
    );

    await this.repository.save(creditNote);
    await this.eventBus.publish({ eventName: "credit_note.issued", id: creditNote.id, invoiceId: creditNote.invoiceId });

    return { id: creditNote.id };
  }
}
