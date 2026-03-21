import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

/**
 * Drizzle Kit Configuration for the workspace.
 *
 * Usage commands:
 * - `pnpm run generate`: Reads your Drizzle schema and generates the SQL migration files.
 * - `pnpm run push`: Updates the database schema directly without generating migration files.
 * - `pnpm run studio`: Launches the local Drizzle Studio to view, edit, and explore your database records.
 */
export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  schemaFilter: ["revstack"],
  verbose: true,
  strict: true,
});
