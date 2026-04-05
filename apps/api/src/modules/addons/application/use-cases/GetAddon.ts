import { z } from "zod";
import type { AddonRepository } from "@revstackhq/core";
import { AddonNotFoundError } from "@revstackhq/core";

export const GetAddonQuerySchema = z.object({
  id: z.string().min(1),
});

export type GetAddonQuery = z.infer<typeof GetAddonQuerySchema>;

export const GetAddonResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  name: z.string(),
  type: z.string(),
  is_archived: z.boolean(),
  metadata: z.record(z.any()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type GetAddonResponse = z.infer<typeof GetAddonResponseSchema>;

export class GetAddonHandler {
  constructor(private readonly repository: AddonRepository) {}

  public async execute(query: GetAddonQuery): Promise<GetAddonResponse> {
    const addon = await this.repository.findById(query.id);
    if (!addon) {
      throw new AddonNotFoundError();
    }

    const v = addon.val;
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
  }
}
