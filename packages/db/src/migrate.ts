import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "./client.js";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required to run migrations");
  process.exit(1);
}

const { db, pool } = createDatabase(databaseUrl);
await migrate(db, { migrationsFolder: "drizzle" });
await pool.end();
console.log("migrations applied");
