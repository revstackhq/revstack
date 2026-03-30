import { z } from "zod";

export const ListCouponsQuerySchema = z.object({
  environment_id: z.string().min(1, "Environment is required"),
  is_active: z.enum(["true", "false"]).transform(v => v === "true").optional(),
  is_archived: z.enum(["true", "false"]).transform(v => v === "true").optional(),
});

export type ListCouponsQuery = z.infer<typeof ListCouponsQuerySchema>;
