CREATE TABLE `goals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wallet_address` text NOT NULL,
	`name` text NOT NULL,
	`target` real NOT NULL,
	`current` real DEFAULT 0 NOT NULL,
	`symbol` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
