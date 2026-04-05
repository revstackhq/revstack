import { z } from "zod";
import type { ApiKeyRepository } from "@revstackhq/core";

export const listApiKeysSchema = z.object({
  environmentId: z.string().min(1, "Environment ID is required"),
  type: z.enum(["public", "secret"]).optional(),
});

export type ListApiKeysQuery = z.infer<typeof listApiKeysSchema>;

export class ListApiKeysHandler {
  constructor(private readonly repository: ApiKeyRepository) {}

  public async execute(query: ListApiKeysQuery) {
    const keys = await this.repository.findByEnvironmentId(query.environmentId, query.type);
    return keys.map(k => k.val);
  }
}
