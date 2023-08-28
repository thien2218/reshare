CREATE TABLE `resource_tags` (
	`resource_id` text,
	`tag_id` text,
	PRIMARY KEY(`resource_id`, `tag_id`),
	FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`keyword` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE articles ADD `rating_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE articles ADD `total_rating` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `tags_keyword_unique` ON `tags` (`keyword`);--> statement-breakpoint
ALTER TABLE `articles` DROP COLUMN `average_rating`;