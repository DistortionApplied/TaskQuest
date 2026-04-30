import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

const dbPath = process.env.DB_URL?.replace("file:", "") || "./app.db";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;
let sqlite: Database.Database | null = null;

function initDb() {
  if (!dbInstance) {
    try {
      sqlite = new Database(dbPath);
      sqlite.pragma("journal_mode = WAL");
      dbInstance = drizzle(sqlite, { schema });
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }
  return dbInstance;
}

// Initialize immediately on module load
try {
  initDb();
} catch (error) {
  console.error("Database initialization error:", error);
}

export const db = {
  get select() {
    return initDb().select;
  },
  get insert() {
    return initDb().insert;
  },
  get update() {
    return initDb().update;
  },
  get delete() {
    return initDb().delete;
  },
  get query() {
    return initDb().query;
  },
  get transaction() {
    return initDb().transaction;
  },
} as unknown as ReturnType<typeof drizzle<typeof schema>>;
