import { z } from "zod";
import type { CreditNoteRepository } from "@revstackhq/core";
import type { EventBus } from "@/common/application/ports/EventBus";
import { CreditNoteEntity } from "@revstackhq/core";

export const CreateCreditNoteCommandSchema = z.object({
  invoice_id: z.string().min(1),
  amount: z.number().positive(),
  reason: z.string().optional(),
});

export type CreateCreditNoteCommand = z.infer<typeof CreateCreditNoteCommandSchema>;

export const CreateCreditNoteResponseSchema = z.object({
  id: z.string(),
});

export type CreateCreditNoteResponse = z.infer<typeof CreateCreditNoteResponseSchema>;

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
