import { z } from "zod";
import type { AuthConfigRepository } from "@revstackhq/core";

export const listAuthConfigsSchema = z.object({
  environmentId: z.string().min(1, "Environment ID is required"),
  status: z.enum(["active", "archived"]).optional(),
});

export type ListAuthConfigsQuery = z.infer<typeof listAuthConfigsSchema>;

export class ListAuthConfigsHandler {
  constructor(private readonly repository: AuthConfigRepository) {}

  public async execute(query: ListAuthConfigsQuery) {
    const configs = await this.repository.findByEnvironmentId(query.environmentId, query.status);
    return configs.map(c => c.val);
  }
}
