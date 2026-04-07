import type { DrizzleDB } from "@revstackhq/db";
import type { EventBus } from "@/common/application/ports/EventBus";
import { PostgresCustomerRepository } from "@/modules/customers/infrastructure/adapters/PostgresCustomerRepository";
import { CreateCustomerHandler } from "@/modules/customers/application/use-cases/CreateCustomer";
import { CreateCustomersBatchHandler } from "@/modules/customers/application/use-cases/CreateCustomersBatch";
import { UpdateCustomerHandler } from "@/modules/customers/application/use-cases/UpdateCustomer";
import { ArchiveCustomerHandler } from "@/modules/customers/application/use-cases/ArchiveCustomer";
import { GetCustomerHandler } from "@/modules/customers/application/use-cases/GetCustomer";
import { ListCustomersHandler } from "@/modules/customers/application/use-cases/ListCustomers";

export function buildCustomersModule(db: DrizzleDB, eventBus: EventBus) {
  const repository = new PostgresCustomerRepository(db);

  return {
    get create() {
      return new CreateCustomerHandler(repository, eventBus);
    },
    get createBatch() {
      return new CreateCustomersBatchHandler(repository, eventBus);
    },
    get update() {
      return new UpdateCustomerHandler(repository, eventBus);
    },
    get archive() {
      return new ArchiveCustomerHandler(repository, eventBus);
    },
    get get() {
      return new GetCustomerHandler(repository);
    },
    get list() {
      return new ListCustomersHandler(repository);
    },
  };
}
