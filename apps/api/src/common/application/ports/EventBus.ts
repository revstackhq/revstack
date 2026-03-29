import { DomainEvent } from "@/common/domain/events/DomainEvent";

export interface EventBus {
  publish(events: DomainEvent | DomainEvent[]): Promise<void>;
}
