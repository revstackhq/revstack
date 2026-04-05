import type { PriceEntity } from "@/domain/aggregates/prices/PriceEntity";

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
