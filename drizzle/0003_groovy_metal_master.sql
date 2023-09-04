CREATE TABLE `reactions` (
	`user_id` text NOT NULL,
	`reactable_id` text NOT NULL,
	`type` text NOT NULL,
	`reactable_type` text NOT NULL,
	PRIMARY KEY(`reactable_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
