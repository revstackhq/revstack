export class ApiKeyEntity {
  constructor(
    public readonly id: string,
    public tenantId: string,
    public keyPrefix: string,
    public keyHash: string,
    public name: string,
    public isActive: boolean = true,
    public createdAt: Date = new Date()
  ) {}

  public static create(tenantId: string, name: string): { entity: ApiKeyEntity, rawKey: string } {
    // Scaffold implementation, crypto logic omitted for brevity
    const rawKey = "rvstk_" + crypto.randomUUID().replace(/-/g, "");
    const keyPrefix = rawKey.substring(0, 10);
    const keyHash = "hashed_" + rawKey; 

    const entity = new ApiKeyEntity(crypto.randomUUID(), tenantId, keyPrefix, keyHash, name, true);
    return { entity, rawKey };
  }

  public revoke(): void {
    if (!this.isActive) {
      throw new Error("ApiKeyAlreadyRevoked");
    }
    this.isActive = false;
  }
}
