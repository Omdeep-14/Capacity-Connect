import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../config/env.js";
import { Pool } from "../../node_modules/@types/pg/index.js";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
});
export const db = drizzle({
  client: pool,
});
