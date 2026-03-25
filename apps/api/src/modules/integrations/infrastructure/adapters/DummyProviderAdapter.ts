import type { ProviderAdapter } from "@/modules/integrations/application/ports/ProviderAdapter";

export class DummyProviderAdapter implements ProviderAdapter {
  public async verifyCredentials(config: Record<string, any>): Promise<boolean> {
    return true; // Scaffold implementation
  }

  public async sync(integrationId: string, config: Record<string, any>): Promise<void> {
    // Scaffold implementation
  }

  public async disconnect(integrationId: string): Promise<void> {
    // Scaffold implementation
  }
}
