import { z } from "zod";

export const listCouponsSchema = z.object({
  environmentId: z.string().min(1, "Environment is required"),
  isActive: z.enum(["true", "false"]).transform(v => v === "true").optional(),
  isArchived: z.enum(["true", "false"]).transform(v => v === "true").optional(),
});

export type ListCouponsQuery = z.infer<typeof listCouponsSchema>;
