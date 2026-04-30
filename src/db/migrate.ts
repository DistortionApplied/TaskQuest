import Database from "bun:sqlite";
import { readdir, readFile } from "fs/promises";
import { resolve } from "path";
import * as schema from "./schema";

const dbPath = process.env.DB_URL?.replace("file:", "") || "./app.db";
const db = new Database(dbPath);

// Simple migration runner for bun:sqlite
async function runMigrations() {
  // Create migrations table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash text NOT NULL UNIQUE,
      created_at numeric DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const migrationsDir = resolve("./src/db/migrations");
  const migrationFiles = (await readdir(migrationsDir))
    .filter(f => f.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    const hash = file;
    const existing = db.query(
      "SELECT * FROM __drizzle_migrations WHERE hash = ?"
    ).get(hash);

    if (!existing) {
      const sql = await readFile(resolve(migrationsDir, file), "utf-8");
      // Split by semicolon and execute each statement
      const statements = sql.split(";").filter(s => s.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          db.run(statement);
        }
      }
      db.run("INSERT INTO __drizzle_migrations (hash) VALUES (?)", [hash]);
      console.log(`✓ Executed migration: ${file}`);
    }
  }

  console.log("✓ Migrations completed successfully!");
}

await runMigrations();