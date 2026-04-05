import { z } from "zod";
import type { AddonRepository } from "@revstackhq/core";

export const ListAddonsQuerySchema = z.object({
  environment_id: z.string().min(1, "Environment is required"),
  is_archived: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .optional(),
});

export type ListAddonsQuery = z.infer<typeof ListAddonsQuerySchema>;

export const AddonResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  name: z.string(),
  type: z.string(),
  is_archived: z.boolean(),
  metadata: z.record(z.any()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const ListAddonsResponseSchema = z.array(AddonResponseSchema);

export type ListAddonsResponse = z.infer<typeof ListAddonsResponseSchema>;

export class ListAddonsHandler {
  constructor(private readonly repository: AddonRepository) {}

  public async execute(query: ListAddonsQuery): Promise<ListAddonsResponse> {
    const addons = await this.repository.find({
      environmentId: query.environment_id,
      isArchived: query.is_archived,
    });

    return addons.map((a) => {
      const v = a.val;
      return {
        id: v.id!,
        environment_id: v.environmentId,
        name: v.name,
        type: v.type,
        is_archived: v.isArchived,
        metadata: v.metadata,
        created_at: v.createdAt,
        updated_at: v.updatedAt,
      };
    });
  }
}
