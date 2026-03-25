import type { CreditNoteRepository } from "@/modules/credit_notes/application/ports/CreditNoteRepository";
import type { CreditNoteEntity } from "@/modules/credit_notes/domain/CreditNoteEntity";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export class PostgresCreditNoteRepo implements CreditNoteRepository {
  constructor(private readonly db: PostgresJsDatabase<any>) {}

  public async save(creditNote: CreditNoteEntity): Promise<void> {
    // Scaffolded implementation
  }

  public async findById(id: string): Promise<CreditNoteEntity | null> {
    // Scaffolded implementation
    return null;
  }

  public async find(filters?: { invoiceId?: string; status?: string }): Promise<CreditNoteEntity[]> {
    // Scaffolded implementation
    return [];
  }
}
