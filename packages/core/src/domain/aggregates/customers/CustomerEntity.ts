import { Entity } from "@/domain/base/Entity";
import { generateId } from "@/utils/id";
import { CustomerAlreadyArchivedError } from "@/domain/aggregates/customers/CustomerErrors";
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
    const entity = new CustomerEntity({
      ...props,
      id: generateId("cus"),
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: props.phone ?? undefined,
      metadata: props.metadata ?? {},
    });

    entity.addEvent(
      new CustomerCreatedEvent({
        id: entity.val.id,
        environmentId: entity.val.environmentId,
      }),
    );

    return entity;
  }

  public update(props: UpdateCustomerProps): void {
    if (props.name !== undefined) {
      this.props.name = props.name;
    }

    if (props.email !== undefined) {
      this.props.email = props.email;
    }

    if (props.phone !== undefined) {
      this.props.phone = props.phone;
    }

    if (props.billingAddress !== undefined) {
      this.props.billingAddress = props.billingAddress;
    }

    if (props.taxIds !== undefined) {
      this.props.taxIds = props.taxIds;
    }

    if (props.metadata !== undefined) {
      this.props.metadata = { ...this.props.metadata, ...props.metadata };
    }

    this.props.updatedAt = new Date();

    this.addEvent(
      new CustomerUpdatedEvent({
        id: this.val.id,
        environmentId: this.val.environmentId,
      }),
    );
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
}
