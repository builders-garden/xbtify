/** biome-ignore-all lint/performance/noNamespaceImport: drizzle import schema */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dbSchema from "@/lib/database/db.schema";
import { env } from "@/lib/env";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: dbSchema,
});
