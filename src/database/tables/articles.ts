import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Table definition
export const articles = sqliteTable("articles", {
   id: text("id").primaryKey(),
   title: text("title").unique().notNull(),
   contentMdUrl: text("content_md_url").notNull(),
   wordCount: integer("word_count").notNull(),
   averageRating: real("average_rating").notNull().default(0)
});
