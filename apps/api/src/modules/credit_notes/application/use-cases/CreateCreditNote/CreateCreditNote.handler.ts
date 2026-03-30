import type { CreditNoteRepository } from "@/modules/credit_notes/application/ports/CreditNoteRepository";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CreateCreditNoteCommand } from "./CreateCreditNote.schema";
import { CreditNoteEntity } from "@/modules/credit_notes/domain/CreditNoteEntity";

export class CreateCreditNoteHandler {
  constructor(
    private readonly repository: CreditNoteRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute(command: CreateCreditNoteCommand) {
    const creditNote = CreditNoteEntity.issue(
      command.invoice_id,
      command.amount,
      command.reason,
    );

    await this.repository.save(creditNote);

    return { id: creditNote.val.id! };
  }
}
