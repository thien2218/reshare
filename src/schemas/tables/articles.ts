import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { resources } from "./resources";

// Table definition
export const articles = sqliteTable("articles", {
   id: text("id").primaryKey(),
   title: text("title").unique().notNull(),
   contentMdUrl: text("content_md_url").notNull(),
   wordCount: integer("word_count").notNull(),
   averageRating: real("average_rating").notNull().default(0)
});

export const articleResourceRelation = relations(articles, ({ one }) => ({
   info: one(resources, {
      fields: [articles.id],
      references: [resources.articleId]
   })
}));
