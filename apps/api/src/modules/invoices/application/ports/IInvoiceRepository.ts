import type { InvoiceEntity } from "@/modules/invoices/domain/InvoiceEntity";

export interface IInvoiceRepository {
  save(invoice: InvoiceEntity): Promise<void>;
  findById(id: string): Promise<InvoiceEntity | null>;
  findAll(): Promise<InvoiceEntity[]>;
}
