import type { InvoiceRepository } from "@revstackhq/core";
import type { InvoiceEntity } from "@revstackhq/core";
import type { InvoiceLineItemEntity } from "@revstackhq/core";

export class PostgresInvoiceRepository implements InvoiceRepository {
  constructor(private readonly db: any) {}

  async save(invoice: InvoiceEntity): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<InvoiceEntity | null> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<InvoiceEntity[]> {
    throw new Error("Method not implemented.");
  }

  public async find(filters?: any): Promise<InvoiceEntity[]> {
    return []; // Implement
  }

  public async saveLineItem(lineItem: InvoiceLineItemEntity): Promise<void> {
    // Implement
  }

  public async findLineItemById(
    id: string,
  ): Promise<InvoiceLineItemEntity | null> {
    return null; // Implement
  }

  public async deleteLineItem(id: string): Promise<void> {
    // Implement
  }
}
