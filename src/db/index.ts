import Database from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";

const dbPath = process.env.DB_URL?.replace("file:", "") || "./app.db";
const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });