import { BadRequestError } from "@/domain/base/DomainError";

export abstract class Entity<T extends { id?: string }> {
  private _domainEvents: any[] = [];

  protected constructor(protected readonly props: T) {}

  public get val(): Readonly<T> {
    return this.props;
  }

  public assignId(id: string): void {
    if (this.props.id) {
      throw new BadRequestError(
        "Entity already has an ID",
        "ID_ALREADY_ASSIGNED",
      );
    }
    this.props.id = id;
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!this.props.id || !object.props.id) {
      return false;
    }

    return this.props.id === object.props.id;
  }

  protected addEvent(domainEvent: any): void {
    this._domainEvents.push(domainEvent);
  }

  public pullEvents(): any[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
