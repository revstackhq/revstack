import { z } from "zod";

export const CreateEntitlementCommandSchema = z.object({
  environment_id: z.string(),
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["boolean", "metered", "static", "json"]),
  unit_type: z.enum([
    "count",
    "bytes",
    "seconds",
    "tokens",
    "requests",
    "custom",
  ]),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateEntitlementCommand = z.infer<
  typeof CreateEntitlementCommandSchema
>;

export const EntitlementResponseSchema = z.object({
  id: z.string(),
  environment_id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.enum(["boolean", "metered", "static", "json"]),
  unit_type: z.enum([
    "count",
    "bytes",
    "seconds",
    "tokens",
    "requests",
    "custom",
  ]),
  metadata: z.record(z.string(), z.unknown()).optional(),
  created_at: z.date(),
});
