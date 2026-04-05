import { DomainEvent } from "@revstackhq/core";

export interface EventBus {
  publish(events: DomainEvent | DomainEvent[]): Promise<void>;
}
