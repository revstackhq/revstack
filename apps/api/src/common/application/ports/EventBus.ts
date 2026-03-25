export interface EventBus {
  publish(event: any): Promise<void>;
}
