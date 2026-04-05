import { z } from "zod";
import type { EnvironmentRepository } from "@revstackhq/core";
import type { EnvironmentEntity } from "@revstackhq/core";

export const ListEnvironmentsQuerySchema = z.object({
  project_id: z.string().optional(),
});

export type ListEnvironmentsQuery = z.infer<typeof ListEnvironmentsQuerySchema>;

export const ListEnvironmentsResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    is_default: z.boolean(),
    project_id: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
  }),
);

export type ListEnvironmentsResponse = z.infer<
  typeof ListEnvironmentsResponseSchema
>;

export class ListEnvironmentsHandler {
  constructor(private readonly repository: EnvironmentRepository) {}

  public async execute(
    query: ListEnvironmentsQuery,
  ): Promise<ListEnvironmentsResponse> {
    const envs = await this.repository.findAll({ projectId: query.project_id });

    return envs.map((e: EnvironmentEntity) => ({
      id: e.val.id!,
      name: e.val.name,
      slug: e.val.slug,
      is_default: e.val.isDefault,
      project_id: e.val.projectId!,
      created_at: e.val.createdAt,
      updated_at: e.val.updatedAt,
    }));
  }
}
