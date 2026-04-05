import type { CreditNoteRepository } from "@revstackhq/core";
import type { CreditNoteEntity } from "@revstackhq/core";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export class PostgresCreditNoteRepository implements CreditNoteRepository {
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
