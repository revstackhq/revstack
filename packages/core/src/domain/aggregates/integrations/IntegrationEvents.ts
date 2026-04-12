import { DomainEvent } from "@/domain/base/DomainEvent";
import { DOMAIN_EVENTS } from "@/constants";
import { IntegrationMode, IntegrationStatus } from "./IntegrationEntity";

// --- INTEGRATION INSTALLED ---
export interface IntegrationInstalledPayload {
  integrationId: string;
  environmentId: string;
  provider: string;
}

export class IntegrationInstalledEvent extends DomainEvent<IntegrationInstalledPayload> {
  public readonly eventName = DOMAIN_EVENTS.INTEGRATION_INSTALLED;

  constructor(payload: IntegrationInstalledPayload) {
    super(payload);
  }
}

// --- INTEGRATION CONFIG UPDATED ---
export interface IntegrationConfigUpdatedPayload {
  integrationId: string;
  environmentId: string;
}

export class IntegrationConfigUpdatedEvent extends DomainEvent<IntegrationConfigUpdatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.INTEGRATION_CONFIG_UPDATED;

  constructor(payload: IntegrationConfigUpdatedPayload) {
    super(payload);
  }
}

// --- INTEGRATION UNINSTALLED ---
export interface IntegrationUninstalledPayload {
  integrationId: string;
  environmentId: string;
  provider: string;
}

export class IntegrationUninstalledEvent extends DomainEvent<IntegrationUninstalledPayload> {
  public readonly eventName = DOMAIN_EVENTS.INTEGRATION_UNINSTALLED;

  constructor(payload: IntegrationUninstalledPayload) {
    super(payload);
  }
}

export interface IntegrationErrorPayload {
  integrationId: string;
  environmentId: string;
  errorCode: string;
  errorMessage: string;
}

export class IntegrationErrorEvent extends DomainEvent<IntegrationErrorPayload> {
  public readonly eventName = DOMAIN_EVENTS.INTEGRATION_ERROR;

  constructor(payload: IntegrationErrorPayload) {
    super(payload);
  }
}

// --- INTEGRATION UPDATED ---
export interface IntegrationUpdatedPayload {
  integrationId: string;
  environmentId: string;
  status?: IntegrationStatus;
  mode?: IntegrationMode;
}

export class IntegrationUpdatedEvent extends DomainEvent<IntegrationUpdatedPayload> {
  public readonly eventName = DOMAIN_EVENTS.INTEGRATION_UPDATED;

  constructor(payload: IntegrationUpdatedPayload) {
    super(payload);
  }
}
