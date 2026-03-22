import type { IInvoiceRepository } from "@/modules/invoices/application/ports/IInvoiceRepository";
import type { InvoiceEntity } from "@/modules/invoices/domain/InvoiceEntity";

export class PostgresInvoiceRepo implements IInvoiceRepository {
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
}
