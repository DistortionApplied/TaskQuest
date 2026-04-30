import Database from "better-sqlite3";
import { readdir, readFile } from "fs/promises";
import { resolve } from "path";

async function main() {
  const dbPath = process.env.DB_URL?.replace("file:", "") || "./app.db";
  const db = new Database(dbPath);

  // Create migrations table if it doesn't exist
  db.exec(`
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
    const existing = db
      .prepare("SELECT * FROM __drizzle_migrations WHERE hash = ?")
      .get(hash);

    if (!existing) {
      const sql = await readFile(resolve(migrationsDir, file), "utf-8");
      db.exec(sql);
      db.prepare("INSERT INTO __drizzle_migrations (hash) VALUES (?)").run(
        hash
      );
      console.log(`✓ Executed migration: ${file}`);
    }
  }

  console.log("✓ Migrations completed successfully!");
  db.close();
}

main().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
