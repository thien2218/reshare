import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { posts } from "./posts";
import { articles } from "./articles";

export const resources = sqliteTable("resources", {
   id: text("id").primaryKey(),
   authorId: text("author_id")
      .references(() => users.id)
      .notNull(),
   articleId: text("article_id")
      .references(() => articles.id)
      .unique(),
   postId: text("post_id")
      .references(() => posts.id)
      .unique(),

   scope: text("scope").notNull(),
   allowComments: integer("allow_comments", { mode: "boolean" }).notNull(),

   likeCount: integer("like_count").notNull().default(0),
   dislikeCount: integer("dislike_count").notNull().default(0),
   commentsCount: integer("comments_count").notNull().default(0),

   createdAt: text("created_at").notNull(),
   updatedAt: text("updated_at").notNull()
});
