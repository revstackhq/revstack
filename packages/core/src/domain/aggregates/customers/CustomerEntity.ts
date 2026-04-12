import { Entity } from "@/domain/base/Entity";
import { generateId } from "@/utils/id";
import {
  CustomerAlreadyArchivedError,
  InvalidCurrencyError,
  InvalidCustomerEmailError,
} from "@/domain/aggregates/customers/CustomerErrors";
import {
  CustomerCreatedEvent,
  CustomerUpdatedEvent,
  CustomerArchivedEvent,
} from "@/domain/aggregates/customers/CustomerEvents";

export interface CustomerTaxId {
  type: string;
  value: string;
}

export interface CustomerBillingAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export type CustomerStatus = "active" | "archived";

export interface CustomerProps {
  id: string;
  environmentId: string;
  userId: string;
  providerId: string;
  externalId: string;
  email: string;
  name: string;
  phone?: string;
  currency: string;
  billingAddress: CustomerBillingAddress;
  taxIds: CustomerTaxId[];
  status: CustomerStatus;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateCustomerProps = Omit<
  CustomerProps,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export type UpdateCustomerProps = Partial<
  Pick<
    CustomerProps,
    "name" | "email" | "phone" | "billingAddress" | "taxIds" | "metadata"
  >
>;

export class CustomerEntity extends Entity<CustomerProps> {
  private constructor(props: CustomerProps) {
    super(props);
  }

  public static restore(props: CustomerProps): CustomerEntity {
    return new CustomerEntity(props);
  }

  public static create(props: CreateCustomerProps): CustomerEntity {
    if (!props.email.includes("@")) {
      throw new InvalidCustomerEmailError(props.email);
    }

    if (props.currency.length !== 3) {
      throw new InvalidCurrencyError(props.currency);
    }

    const entity = new CustomerEntity({
      ...props,
      id: generateId("cus"),
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: props.phone ?? undefined,
      metadata: props.metadata ?? {},
      taxIds: props.taxIds ?? [],
    });

    entity.addEvent(
      new CustomerCreatedEvent({
        id: entity.val.id,
        environmentId: entity.val.environmentId,
        externalId: entity.val.externalId,
        email: entity.val.email,
      }),
    );

    return entity;
  }

  public update(props: UpdateCustomerProps): void {
    const changes: string[] = [];

    const updateField = <K extends keyof UpdateCustomerProps>(
      key: K,
      value: UpdateCustomerProps[K],
    ) => {
      if (
        value !== undefined &&
        JSON.stringify(this.props[key]) !== JSON.stringify(value)
      ) {
        (this.props as any)[key] = value;
        changes.push(key);
      }
    };

    updateField("name", props.name);
    updateField("email", props.email);
    updateField("phone", props.phone);
    updateField("billingAddress", props.billingAddress);
    updateField("taxIds", props.taxIds);

    if (props.metadata) {
      this.props.metadata = { ...this.props.metadata, ...props.metadata };
      changes.push("metadata");
    }

    if (changes.length > 0) {
      this.props.updatedAt = new Date();
      this.addEvent(
        new CustomerUpdatedEvent({
          id: this.val.id,
          environmentId: this.val.environmentId,
          changes,
        }),
      );
    }
  }

  public archive(): void {
    if (this.props.status === "archived") {
      throw new CustomerAlreadyArchivedError(this.val.id);
    }

    this.props.status = "archived";
    this.props.updatedAt = new Date();

    this.addEvent(
      new CustomerArchivedEvent({
        id: this.val.id,
        environmentId: this.val.environmentId,
      }),
    );
  }

  public isLinkedToProvider(): boolean {
    return !!this.props.providerId && this.props.providerId !== "";
  }
}
