CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content_md_url` text NOT NULL,
	`word_count` integer NOT NULL,
	`average_rating` real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`img_attachments` blob,
	`url_attachments` blob
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`article_id` text,
	`post_id` text,
	`scope` text NOT NULL,
	`allow_comments` integer NOT NULL,
	`likes_count` integer DEFAULT 0 NOT NULL,
	`dislikes_count` integer DEFAULT 0 NOT NULL,
	`comments_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
   CONSTRAINT check_article_post CHECK (
      (article_id IS NOT NULL AND post_id IS NULL) OR 
      (article_id IS NULL AND post_id IS NOT NULL)
   )
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_title_unique` ON `articles` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `resources_article_id_unique` ON `resources` (`article_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `resources_post_id_unique` ON `resources` (`post_id`);