import type { DrizzleDB } from "@revstackhq/db";
import type { EventBus } from "@/common/application/ports/EventBus";
import { PostgresAddonRepository } from "@/modules/addons/infrastructure/adapters/PostgresAddonRepository";
import { PostgresEntitlementRepository } from "@/modules/entitlements/infrastructure/adapters/PostgresEntitlementRepository";
import { CreateAddonHandler } from "@/modules/addons/application/use-cases/CreateAddon";
import { ArchiveAddonHandler } from "@/modules/addons/application/use-cases/ArchiveAddon";
import { ListAddonsHandler } from "@/modules/addons/application/use-cases/ListAddons";
import { GetAddonHandler } from "@/modules/addons/application/use-cases/GetAddon";
import { UpdateAddonHandler } from "@/modules/addons/application/use-cases/UpdateAddon";
import { RemoveAddonEntitlementHandler } from "@/modules/addons/application/use-cases/RemoveAddonEntitlement";
import { UpsertAddonEntitlementHandler } from "@/modules/addons/application/use-cases/UpsertAddonEntitlement";

export function buildAddonsModule(db: DrizzleDB, eventBus: EventBus) {
  const repository = new PostgresAddonRepository(db);
  const entitlementRepository = new PostgresEntitlementRepository(db);

  return {
    get create() {
      return new CreateAddonHandler(repository, entitlementRepository, eventBus);
    },
    get archive() {
      return new ArchiveAddonHandler(repository, eventBus);
    },
    get list() {
      return new ListAddonsHandler(repository);
    },
    get get() {
      return new GetAddonHandler(repository);
    },
    get update() {
      return new UpdateAddonHandler(repository, eventBus);
    },
    get removeEntitlement() {
      return new RemoveAddonEntitlementHandler(repository, eventBus);
    },
    get upsertEntitlement() {
      return new UpsertAddonEntitlementHandler(repository, entitlementRepository, eventBus);
    },
  };
}
