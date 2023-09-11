DROP TABLE `tags`;--> statement-breakpoint
CREATE TABLE `tags` (
   `keyword` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
DROP TABLE `resource_tags`;--> statement-breakpoint
CREATE TABLE `resource_tags` (
	`resource_id` text NOT NULL,
	`tag_keyword` text NOT NULL,
	PRIMARY KEY(`resource_id`, `tag_keyword`),
	FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`tag_keyword`) REFERENCES `tags`(`keyword`) ON UPDATE no action ON DELETE cascade
);
