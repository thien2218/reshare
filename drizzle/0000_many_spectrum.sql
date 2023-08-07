CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`encrypted_password` text,
	`email_verified` integer,
	`photo_url` text,
	`bio` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
