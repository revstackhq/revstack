import { z } from "zod";
import type { EnvironmentRepository } from "@revstackhq/core";
import { EnvironmentNotFoundError } from "@revstackhq/core";

export const GetEnvironmentQuerySchema = z.object({
  id: z.string(),
});

export type GetEnvironmentQuery = z.infer<typeof GetEnvironmentQuerySchema>;

export const GetEnvironmentResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  is_default: z.boolean(),
  project_id: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type GetEnvironmentResponse = z.infer<
  typeof GetEnvironmentResponseSchema
>;

export class GetEnvironmentHandler {
  constructor(private readonly repository: EnvironmentRepository) {}

  public async execute(
    query: GetEnvironmentQuery,
  ): Promise<GetEnvironmentResponse> {
    const environment = await this.repository.findById(query.id);

    if (!environment) {
      throw new EnvironmentNotFoundError();
    }

    return {
      id: environment.val.id!,
      name: environment.val.name,
      slug: environment.val.slug,
      is_default: environment.val.isDefault,
      project_id: environment.val.projectId!,
      created_at: environment.val.createdAt,
      updated_at: environment.val.updatedAt,
    };
  }
}
