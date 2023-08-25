CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`encrypted_password` text,
	`email_verified` integer NOT NULL,
	`photo_url` text,
	`bio` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`refresh_token` text,
	`provider` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);