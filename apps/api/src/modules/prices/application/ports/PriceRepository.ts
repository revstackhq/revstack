import type { PriceEntity } from "@/modules/prices/domain/PriceEntity";

export interface PriceRepository {
  save(price: PriceEntity): Promise<string>;
  findById(id: string): Promise<PriceEntity | null>;
  find(filters: {
    environmentId?: string;
    planId?: string;
    addonId?: string;
    isArchived?: boolean;
  }): Promise<PriceEntity[]>;
}
