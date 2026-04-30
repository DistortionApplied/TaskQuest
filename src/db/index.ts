import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const dbPath = process.env.DB_URL || "file:./app.db";

const client = createClient({
  url: dbPath,
});

export const db = drizzle(client, { schema });
