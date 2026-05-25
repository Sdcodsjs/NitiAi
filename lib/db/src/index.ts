import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("WARNING: DATABASE_URL is not configured. Database features will fail until added.");
}

export const pool = databaseUrl ? new Pool({ connectionString: databaseUrl }) : null;
export const db = pool ? drizzle(pool, { schema }) : null;

export * from "./schema";
