import { createClient } from "@libsql/client";
import { readdir, readFile } from "fs/promises";
import { resolve } from "path";

async function main() {
  const dbPath = process.env.DB_URL || "file:./app.db";
  const client = createClient({
    url: dbPath,
  });

  // Create migrations table if it doesn't exist
  await client.execute(`
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
    const existing = await client.execute(
      "SELECT * FROM __drizzle_migrations WHERE hash = ?",
      [hash]
    );

    if (existing.rows.length === 0) {
      const sql = await readFile(resolve(migrationsDir, file), "utf-8");
      // Split and execute each statement
      const statements = sql.split(";").filter(s => s.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          await client.execute(statement);
        }
      }
      await client.execute("INSERT INTO __drizzle_migrations (hash) VALUES (?)", [
        hash,
      ]);
      console.log(`✓ Executed migration: ${file}`);
    }
  }

  console.log("✓ Migrations completed successfully!");
  await client.close();
}

main().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
