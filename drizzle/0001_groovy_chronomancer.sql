CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`title` text NOT NULL,
	`content_md_url` text NOT NULL,
	`word_count` integer NOT NULL,
	`scope` text DEFAULT 'public' NOT NULL,
	`allow_comments` integer DEFAULT true NOT NULL,
	`likes_count` integer DEFAULT 0 NOT NULL,
	`dislikes_count` integer DEFAULT 0 NOT NULL,
	`comments_count` integer DEFAULT 0 NOT NULL,
	`average_rating` real DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`content` text NOT NULL,
	`img_attachments` blob,
	`url_attachments` blob,
	`scope` text DEFAULT 'public' NOT NULL,
	`allow_comments` integer DEFAULT true NOT NULL,
	`likes_count` integer DEFAULT 0 NOT NULL,
	`dislikes_count` integer DEFAULT 0 NOT NULL,
	`comments_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `users` DROP `provider`;--> statement-breakpoint
ALTER TABLE `users` ADD `provider` text DEFAULT 'email' NOT NULL;