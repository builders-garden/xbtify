import dotenv from "dotenv";
import type { Config } from "drizzle-kit";
import { env } from "@/lib/env";

dotenv.config({
  path: ".env",
});

export default {
  schema: "./src/lib/database/db.schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
  },
} satisfies Config;
