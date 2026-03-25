import type { UsageRepository } from "@/modules/usage/application/ports/UsageRepository";
import type { ListUsagesQuery } from "@/modules/usage/application/queries/ListUsagesQuery";

export class ListUsagesHandler {
  constructor(private readonly repository: UsageRepository) {}

  public async handle(query: ListUsagesQuery) {
    const records = await this.repository.findRecords({
      customerId: query.customerId,
      featureId: query.featureId,
    });
    return records;
  }
}
