import { z } from "zod";
import type { CreditNoteRepository } from "@revstackhq/core";
import { NotFoundError } from "@revstackhq/core";

export const GetCreditNoteQuerySchema = z.object({
  id: z.string().min(1),
});

export type GetCreditNoteQuery = z.infer<typeof GetCreditNoteQuerySchema>;

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
