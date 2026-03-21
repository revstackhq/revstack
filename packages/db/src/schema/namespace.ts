import { pgSchema } from "drizzle-orm/pg-core";

/**
 * The dedicated Drizzle namespace schema for Revstack.
 * Provides logical isolation for the billing engine within a shared Postgres database.
 */
export const revstack = pgSchema("revstack");
