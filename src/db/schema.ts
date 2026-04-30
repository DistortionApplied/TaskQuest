import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const requests = sqliteTable("requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  itemType: text("item_type").notNull(), // cigarette, beer, computer_time, etc.
  itemName: text("item_name").notNull(),
  description: text("description"),
  requiredTasksCount: integer("required_tasks_count").default(0),
  completedTasksCount: integer("completed_tasks_count").default(0),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requestId: integer("request_id").references(() => requests.id),
  title: text("title").notNull(),
  description: text("description"),
  xpValue: integer("xp_value").default(10),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  completedAt: integer("completed_at", { mode: "timestamp" }),
});

export const rewards = sqliteTable("rewards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // achievement, level_up, item_unlocked
  description: text("description").notNull(),
  unlockedAt: integer("unlocked_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});