import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { PgDatabase } from "drizzle-orm/pg-core";
import * as schema from "@/schema/index";

/**
 * Universal Drizzle type for Postgres.
 * Instead of a Union, we use PgDatabase which is the base class for all PG drivers.
 * This ensures methods like .returning() are available across both runtimes.
 */
export type DrizzleDB = PgDatabase<any, typeof schema>;

let _db: DrizzleDB | null = null;

export function getDb(): DrizzleDB {
  if (!_db) {
    const url = process.env.DATABASE_URL as string;

    if (process.env.NODE_ENV === "production" && url.includes("neon.tech")) {
      const sql = neon(url);
      // We cast to DrizzleDB to satisfy the generic PgDatabase interface
      _db = drizzleNeon({ client: sql, schema }) as unknown as DrizzleDB;
    } else {
      const sql = neon(url);
      _db = drizzleNeon({ client: sql, schema }) as unknown as DrizzleDB;
    }
  }
  return _db;
}

/**
 * Type-safe Proxy using the base PgDatabase interface
 */
export const db = new Proxy({} as DrizzleDB, {
  get<K extends keyof DrizzleDB>(_target: DrizzleDB, prop: K): DrizzleDB[K] {
    const instance = getDb();
    return Reflect.get(instance, prop);
  },
});

export * from "@/schema/index";
