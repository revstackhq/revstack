import { z } from "zod";

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
