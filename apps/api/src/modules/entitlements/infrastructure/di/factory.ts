import type { DrizzleDB } from "@revstackhq/db";
import type { EventBus } from "@/common/application/ports/EventBus";
import type { CacheService } from "@/common/application/ports/CacheService";
import { PostgresEntitlementRepository } from "@/modules/entitlements/infrastructure/adapters/PostgresEntitlementRepository";
import { CreateEntitlementHandler } from "@/modules/entitlements/application/use-cases/CreateEntitlement";
import { UpdateEntitlementHandler } from "@/modules/entitlements/application/use-cases/UpdateEntitlement";
import { ArchiveEntitlementHandler } from "@/modules/entitlements/application/use-cases/ArchiveEntitlement";
import { GetEntitlementHandler } from "@/modules/entitlements/application/use-cases/GetEntitlement";
import { ListEntitlementsHandler } from "@/modules/entitlements/application/use-cases/ListEntitlements";

export function buildEntitlementsModule(
  db: DrizzleDB,
  eventBus: EventBus,
  cache?: CacheService,
) {
  const repository = new PostgresEntitlementRepository(db);

  return {
    get create() {
      return new CreateEntitlementHandler(repository, eventBus);
    },
    get update() {
      return new UpdateEntitlementHandler(repository, eventBus);
    },
    get archive() {
      return new ArchiveEntitlementHandler(repository, eventBus);
    },
    get get() {
      return new GetEntitlementHandler(repository);
    },
    get list() {
      return new ListEntitlementsHandler(repository, cache);
    },
  };
}
