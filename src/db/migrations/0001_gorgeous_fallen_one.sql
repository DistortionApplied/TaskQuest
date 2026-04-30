PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`item_type` text NOT NULL,
	`item_name` text NOT NULL,
	`description` text,
	`required_tasks_count` integer DEFAULT 0,
	`completed_tasks_count` integer DEFAULT 0,
	`is_completed` integer DEFAULT 0,
	`created_at` integer,
	`completed_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_requests`("id", "user_id", "item_type", "item_name", "description", "required_tasks_count", "completed_tasks_count", "is_completed", "created_at", "completed_at") SELECT "id", "user_id", "item_type", "item_name", "description", "required_tasks_count", "completed_tasks_count", "is_completed", "created_at", "completed_at" FROM `requests`;--> statement-breakpoint
DROP TABLE `requests`;--> statement-breakpoint
ALTER TABLE `__new_requests` RENAME TO `requests`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`request_id` integer,
	`title` text NOT NULL,
	`description` text,
	`xp_value` integer DEFAULT 10,
	`is_completed` integer DEFAULT 0,
	`created_at` integer,
	`completed_at` integer,
	FOREIGN KEY (`request_id`) REFERENCES `requests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "request_id", "title", "description", "xp_value", "is_completed", "created_at", "completed_at") SELECT "id", "request_id", "title", "description", "xp_value", "is_completed", "created_at", "completed_at" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;