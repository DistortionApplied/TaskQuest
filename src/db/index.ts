import * as schema from "./schema";

type DbType = any;

let dbInstance: DbType | null = null;

function getDbInstance(): DbType {
  if (!dbInstance) {
    try {
      const Database = require("better-sqlite3");
      const { drizzle } = require("drizzle-orm/better-sqlite3");

      const dbPath = process.env.DB_URL?.replace("file:", "") || "./app.db";
      const sqlite = new Database(dbPath);
      sqlite.pragma("journal_mode = WAL");
      dbInstance = drizzle(sqlite, { schema });
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }
  return dbInstance;
}

// Create a lazy-loading proxy
export const db: DbType = new Proxy(
  {},
  {
    get(_, prop: string | symbol) {
      const instance = getDbInstance();
      if (typeof prop === "string") {
        return (instance as Record<string, any>)[prop];
      }
      return undefined;
    },
  }
) as unknown as DbType;
