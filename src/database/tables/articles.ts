import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Table definition
export const articles = sqliteTable("articles", {
   id: text("id").primaryKey(),
   title: text("title").unique().notNull(),
   contentMdUrl: text("content_md_url").notNull(),
   wordCount: integer("word_count").notNull(),
   ratingCount: integer("rating_count").notNull().default(0),
   totalRating: integer("total_rating").notNull().default(0)
});
