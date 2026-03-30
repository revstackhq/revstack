import { z } from "zod";

export const ArchiveAddonCommandSchema = z.object({
  id: z.string().min(1),
});

export type ArchiveAddonCommand = z.infer<typeof ArchiveAddonCommandSchema>;

export const ArchiveAddonResponseSchema = z.object({
  success: z.boolean(),
});

export type ArchiveAddonResponse = z.infer<typeof ArchiveAddonResponseSchema>;
