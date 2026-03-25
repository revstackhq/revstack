export interface ProviderAdapter {
  verifyCredentials(config: Record<string, any>): Promise<boolean>;
  sync(integrationId: string, config: Record<string, any>): Promise<void>;
  disconnect(integrationId: string): Promise<void>;
}
