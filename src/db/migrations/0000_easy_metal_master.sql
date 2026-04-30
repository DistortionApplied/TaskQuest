CREATE TABLE `requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`item_type` text NOT NULL,
	`item_name` text NOT NULL,
	`description` text,
	`required_tasks_count` integer DEFAULT 0,
	`completed_tasks_count` integer DEFAULT 0,
	`is_completed` integer DEFAULT false,
	`created_at` integer,
	`completed_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rewards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`unlocked_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`request_id` integer,
	`title` text NOT NULL,
	`description` text,
	`xp_value` integer DEFAULT 10,
	`is_completed` integer DEFAULT false,
	`created_at` integer,
	`completed_at` integer,
	FOREIGN KEY (`request_id`) REFERENCES `requests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`xp` integer DEFAULT 0,
	`level` integer DEFAULT 1,
	`created_at` integer
);
