import type { InvoiceEntity } from "@/modules/invoices/domain/InvoiceEntity";
import type { InvoiceLineItemEntity } from "@/modules/invoices/domain/InvoiceLineItemEntity";

export interface InvoiceRepository {
  save(invoice: InvoiceEntity): Promise<void>;
  findById(id: string): Promise<InvoiceEntity | null>;
  findAll(filters?: { customerId?: string }): Promise<InvoiceEntity[]>;

  saveLineItem(lineItem: InvoiceLineItemEntity): Promise<void>;
  findLineItemById(id: string): Promise<InvoiceLineItemEntity | null>;
  deleteLineItem(id: string): Promise<void>;
}
